using System.Security.Cryptography;
using System.Text.RegularExpressions;

public class LocalFileStorageService : IFileStorageService
{
    private const long MaxFileSizeBytes = 1024 * 1024 * 10; // 10 MB
    private static readonly Regex HashPattern = new(@"^[0-9a-f]{64}$", RegexOptions.Compiled);
    private readonly string _basePath;
    private readonly ILogger<LocalFileStorageService> _logger;

    public LocalFileStorageService(IWebHostEnvironment env, ILogger<LocalFileStorageService> logger)
    {
        _basePath = Path.Combine(env.ContentRootPath, "files");
        Directory.CreateDirectory(_basePath);
        _logger = logger;
    }

    public async Task<string> SaveFileAsync(Stream fileStream, CancellationToken cancellationToken = default)
    {
        if (fileStream.CanSeek && fileStream.Length > MaxFileSizeBytes)
            throw new ArgumentException($"File exceeds the {MaxFileSizeBytes / 1024 / 1024} MB limit.");

        await using var memory = new MemoryStream();
        await fileStream.CopyToAsync(memory, cancellationToken);

        if (memory.Length > MaxFileSizeBytes)
            throw new ArgumentException($"File exceeds the {MaxFileSizeBytes / 1024 / 1024} MB limit.");

        memory.Position = 0;
        using var sha256 = SHA256.Create();
        var hashBytes = await sha256.ComputeHashAsync(memory, cancellationToken);
        var hash = Convert.ToHexStringLower(hashBytes);

        var filePath = Path.Combine(_basePath, hash);
        if (!File.Exists(filePath))
        {
            memory.Position = 0;
            await using var output = File.Create(filePath);
            await memory.CopyToAsync(output, cancellationToken);
            _logger.LogDebug("Saved local file for hash={Hash}", hash);
        }

        return hash;
    }

    public Task<Stream> GetFileAsync(string hash, CancellationToken cancellationToken = default)
    {
        if (!HashPattern.IsMatch(hash))
            throw new ArgumentException("Invalid hash format");

        var filePath = Path.Combine(_basePath, hash);
        if (!File.Exists(filePath))
            throw new FileNotFoundException($"File with hash {hash} not found", filePath);

        Stream stream = File.OpenRead(filePath);
        return Task.FromResult(stream);
    }

    public Task DeleteFileAsync(string hash, CancellationToken cancellationToken = default)
    {
        if (!HashPattern.IsMatch(hash))
            throw new ArgumentException("Invalid hash format");

        var filePath = Path.Combine(_basePath, hash);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
            _logger.LogDebug("DeleteFileAsync: Deleted local file hash={Hash}", hash);
        }
        else
        {
            _logger.LogDebug("DeleteFileAsync: Local file not found hash={Hash}", hash);
        }

        return Task.CompletedTask;
    }
}