using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Azure;
using Azure.Storage.Blobs;

public class BlobStorageService : IFileStorageService
{
    private const long MaxFileSizeBytes = 1024 * 1024 * 10; // 10 MB
    private static readonly Regex HashPattern = new(@"^[0-9a-f]{64}$", RegexOptions.Compiled);
    private readonly BlobContainerClient _container;
    private readonly ILogger<BlobStorageService> _logger;
    private readonly Lazy<Task> _containerReady;

    public BlobStorageService(IConfiguration configuration, ILogger<BlobStorageService> logger)
    {
        var connectionString = configuration.GetValue<string>("AzureBlobStorage:ConnectionString")!;
        var containerName = configuration.GetValue<string>("AzureBlobStorage:ContainerName")!;
        _container = new BlobContainerClient(connectionString, containerName);
        _logger = logger;
        _containerReady = new Lazy<Task>(() => _container.CreateIfNotExistsAsync());
    }

    public async Task<string> SaveFileAsync(Stream fileStream, CancellationToken cancellationToken = default)
    {
        await _containerReady.Value;

        if (fileStream.CanSeek && fileStream.Length > MaxFileSizeBytes)
        {
            throw new ArgumentException($"File exceeds the {MaxFileSizeBytes / 1024 / 1024} MB limit.");
        }
        using var memoryStream = new MemoryStream();

        await fileStream.CopyToAsync(memoryStream, cancellationToken);

        if (memoryStream.Length > MaxFileSizeBytes)
        {
            throw new ArgumentException($"File exceeds the {MaxFileSizeBytes / 1024 / 1024} MB limit.");
        }

        memoryStream.Position = 0;
        using var sha256 = SHA256.Create();
        var hashBytes = await sha256.ComputeHashAsync(memoryStream);
        var hash = Convert.ToHexStringLower(hashBytes);

        var blobClient = _container.GetBlobClient(hash);

        if (!await blobClient.ExistsAsync(cancellationToken))
        {
            memoryStream.Position = 0;
            try
            {

                await blobClient.UploadAsync(memoryStream, cancellationToken);
                _logger.LogDebug("SaveFileAsync: Wrote new file hash={Hash}", hash);
            }
            catch (RequestFailedException exception) when (exception.Status == 409)
            {
                _logger.LogDebug("SaveFileAsync: Blob already exists (hash={Hash}), skipping write", hash);
            }
        }
        else
        {
            _logger.LogDebug("SaveFileAsync: Blob already exists (hash={Hash}), skipping write", hash);
        }

        return hash;
    }

    public async Task<Stream> GetFileAsync(string hash, CancellationToken cancellationToken = default)
    {
        if (!HashPattern.IsMatch(hash))
        {
            throw new ArgumentException("Invalid hash format");
        }

        var blobClient = _container.GetBlobClient(hash);
        try
        {
            var response = await blobClient.DownloadStreamingAsync(cancellationToken: cancellationToken);
            return response.Value.Content;

        }
        catch (RequestFailedException exception) when (exception.Status == 404)
        {
            _logger.LogDebug("GetFileAsync: Blob not found hash={Hash}", hash);
            throw new FileNotFoundException($"File with hash {hash} not found", exception);
        }
    }

    public async Task DeleteFileAsync(string hash, CancellationToken cancellationToken = default)
    {
        if (!HashPattern.IsMatch(hash))
        {
            throw new ArgumentException("Invalid hash format");
        }

        await _containerReady.Value;

        var blobClient = _container.GetBlobClient(hash);
        var deleted = await blobClient.DeleteIfExistsAsync(cancellationToken: cancellationToken);

        if (deleted.Value)
        {
            _logger.LogDebug("DeleteFileAsync: Deleted blob hash={Hash}", hash);
        }
        else
        {
            _logger.LogDebug("DeleteFileAsync: Blob not found hash={Hash}", hash);
        }
    }
}