using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.Models;
using WebAPI.Models.Enums;

public class LocalUploadedFileService : ILocalUploadedFileService
{
    private readonly LocalFileStorageService _localStorage;
    private readonly ApplicationDbContext _dbContext;

    public LocalUploadedFileService(LocalFileStorageService localStorage, ApplicationDbContext dbContext)
    {
        _localStorage = localStorage;
        _dbContext = dbContext;
    }

    public async Task<UploadedFileResponse> UploadFileAsync(IFormFile file, string entraIdObjectId, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.EntraIdObjectId == entraIdObjectId, cancellationToken) ?? throw new UnauthorizedAccessException("User not found");

        var fileType = Path.GetExtension(file.FileName).ToLowerInvariant() switch
        {
            ".csv" => FileType.csv,
            ".xlsx" => FileType.xlsx,
            _ => throw new ArgumentException("Invalid file type")
        };

        await using var stream = file.OpenReadStream();
        var hash = await _localStorage.SaveFileAsync(stream, cancellationToken);

        var uploadedFile = new UploadedFile
        {
            OriginalFileName = file.FileName,
            FileStorageHash = hash,
            FileType = fileType,
            FileSize = file.Length,
            UploadedByUserSeq = user.UserSeq,
            CompanySeq = user.CompanySeq,
            LocalStorage = true,
        };

        _dbContext.UploadedFiles.Add(uploadedFile);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UploadedFileResponse
        {
            FileSeq = uploadedFile.FileSeq,
            OriginalFileName = uploadedFile.OriginalFileName,
            FileType = uploadedFile.FileType,
            FileSize = uploadedFile.FileSize,
            FileUploadedAt = uploadedFile.FileUploadedAt,
            UploadedByUserName = user.UserName,
            InterfaceSeq = uploadedFile.InterfaceSeq,
            StatusSeq = uploadedFile.StatusSeq,
            LocalStorage = uploadedFile.LocalStorage
        };
    }
}