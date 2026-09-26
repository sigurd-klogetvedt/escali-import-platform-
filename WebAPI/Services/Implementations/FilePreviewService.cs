using System.Data;
using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.Models.Enums;
public class FilePreviewService : IFilePreviewService
{
    private readonly BlobStorageService _blobStorageService;
    private readonly LocalFileStorageService _localFileStorageService;
    private readonly ApplicationDbContext _dbContext;

    public FilePreviewService(BlobStorageService blobStorageService, LocalFileStorageService localFileStorageService, ApplicationDbContext dbContext)
    {
        _blobStorageService = blobStorageService;
        _localFileStorageService = localFileStorageService;
        _dbContext = dbContext;
    }

    public async Task<FilePreviewResponse> GetFilePreviewAsync(int fileSeq, string entraIdObjectId, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.EntraIdObjectId == entraIdObjectId, cancellationToken);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        var file = await _dbContext.UploadedFiles.FirstOrDefaultAsync(f => f.FileSeq == fileSeq && f.CompanySeq == user.CompanySeq, cancellationToken);

        if (file == null)
        {
            throw new ArgumentException("File not found");
        }

        using var sourceStream = file.LocalStorage ? await _localFileStorageService.GetFileAsync(file.FileStorageHash, cancellationToken) : await _blobStorageService.GetFileAsync(file.FileStorageHash, cancellationToken);

        using var stream = new MemoryStream();
        await sourceStream.CopyToAsync(stream, cancellationToken);
        stream.Position = 0;

        using var reader = file.FileType == FileType.csv ? ExcelReaderFactory.CreateCsvReader(stream) : ExcelReaderFactory.CreateReader(stream);
        reader.Read();
        var headers = Enumerable.Range(0, reader.FieldCount).Select(i => reader.GetValue(i)?.ToString() ?? $"Column {i + 1}").ToList();

        var rows = new List<List<string>>();
        while (reader.Read() /* && rows.Count < 100 */)
        {
            var row = Enumerable.Range(0, reader.FieldCount).Select(i => reader.GetValue(i)?.ToString() ?? "").ToList();
            rows.Add(row);
        }

        return new FilePreviewResponse { Headers = headers, Rows = rows };
    }
}