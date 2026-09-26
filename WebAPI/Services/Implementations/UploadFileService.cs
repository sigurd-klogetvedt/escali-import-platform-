using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.DTOs.Requests;
using WebAPI.DTOs.Responses;
using WebAPI.Models;
using WebAPI.Models.Enums;
using WebAPI.Services;

public class UploadFileService : IUploadedFileService
{
    private readonly IFileStorageService _fileStorageService;
    private readonly LocalFileStorageService _localFileStorageService;
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<UploadFileService> _logger;

    public UploadFileService(
        IFileStorageService fileStorageService,
        LocalFileStorageService localFileStorageService,
        ApplicationDbContext dbContext,
        ILogger<UploadFileService> logger)
    {
        _dbContext = dbContext;
        _fileStorageService = fileStorageService;
        _localFileStorageService = localFileStorageService;
        _logger = logger;
    }

    public async Task<UploadedFilesResultResponse> GetUploadedFilesAsync(
        string entraIdObjectId,
        GetUploadedFilesQuery query,
        CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.EntraIdObjectId == entraIdObjectId, cancellationToken)
            ?? throw new UnauthorizedAccessException("User not found");

        var statusSeqs = query.StatusSeq?.Distinct().ToList();
        var interfaceSeqs = query.InterfaceSeq?.Distinct().ToList();

        var filesQuery = _dbContext.UploadedFiles.Include(f => f.UploadedByUser).AsQueryable();

        if (!query.IncludeCompanyFiles)
        {
            filesQuery = filesQuery.Where(f => f.UploadedByUserSeq == user.UserSeq);
        }
        else
        {
            var targetCompanySeq = query.CompanySeq ?? user.CompanySeq;

            if (targetCompanySeq != user.CompanySeq /*&& !user.IsAdmin*/)
            {
                throw new UnauthorizedAccessException("Not allowed to view other company files");
            }

            filesQuery = filesQuery.Where(f => f.CompanySeq == targetCompanySeq);
        }

        if (statusSeqs is { Count: > 0 })
        {
            filesQuery = filesQuery.Where(f => f.StatusSeq.HasValue && statusSeqs.Contains(f.StatusSeq.Value));
        }

        if (interfaceSeqs is { Count: > 0 })
        {
            filesQuery = filesQuery.Where(f => f.InterfaceSeq.HasValue && interfaceSeqs.Contains(f.InterfaceSeq.Value));
        }

        var totalCount = await filesQuery.CountAsync(cancellationToken);

        var items = await filesQuery.OrderByDescending(f => f.FileUploadedAt).Select(f => new UploadedFileResponse
        {
            FileSeq = f.FileSeq,
            OriginalFileName = f.OriginalFileName,
            FileType = f.FileType,
            FileSize = f.FileSize,
            FileUploadedAt = f.FileUploadedAt,
            UploadedByUserName = f.UploadedByUser.UserName,
            IsMapped = f.IsMapped,
            InterfaceSeq = f.InterfaceSeq,
            StatusSeq = f.StatusSeq,
            LocalStorage = f.LocalStorage
        }).ToListAsync(cancellationToken);

        return new UploadedFilesResultResponse
        {
            Count = totalCount,
            Items = items
        };
    }

    public async Task<UploadedFileResponse> UploadFileAsync(IFormFile file, string entraIdObjectId)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.EntraIdObjectId == entraIdObjectId) ?? throw new UnauthorizedAccessException("User not found");

        var fileType = Path.GetExtension(file.FileName).ToLower() switch
        {
            ".csv" => FileType.csv,
            ".xlsx" => FileType.xlsx,
            _ => throw new ArgumentException("Invalid file type")
        };

        using var stream = file.OpenReadStream();
        var hash = await _fileStorageService.SaveFileAsync(stream);

        var uploadedFile = new UploadedFile
        {
            OriginalFileName = file.FileName,
            FileStorageHash = hash,
            FileType = fileType,
            FileSize = file.Length,
            UploadedByUserSeq = user.UserSeq,
            CompanySeq = user.CompanySeq,
            LocalStorage = false,
        };

        _dbContext.UploadedFiles.Add(uploadedFile);
        await _dbContext.SaveChangesAsync();

        return new UploadedFileResponse
        {
            FileSeq = uploadedFile.FileSeq,
            OriginalFileName = uploadedFile.OriginalFileName,
            FileType = uploadedFile.FileType,
            FileSize = uploadedFile.FileSize,
            FileUploadedAt = uploadedFile.FileUploadedAt,
            UploadedByUserName = user.UserName,
            IsMapped = uploadedFile.IsMapped,
            InterfaceSeq = uploadedFile.InterfaceSeq,
            StatusSeq = uploadedFile.StatusSeq,
            LocalStorage = uploadedFile.LocalStorage,
        };
    }

    public async Task DeleteUploadedFileAsync(int fileSeq, string entraIdObjectId, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.EntraIdObjectId == entraIdObjectId, cancellationToken)
            ?? throw new UnauthorizedAccessException("User not found");

        // Treat "row missing" and "row belongs to another company" identically so an attacker
        // cannot enumerate fileSeq values across companies. Both surface as 404 at the controller.
        var file = await _dbContext.UploadedFiles
            .FirstOrDefaultAsync(f => f.FileSeq == fileSeq && f.CompanySeq == user.CompanySeq, cancellationToken)
            ?? throw new KeyNotFoundException($"File {fileSeq} not found");

        var hash = file.FileStorageHash;
        var isLocal = file.LocalStorage;

        var hashStillReferenced = await _dbContext.UploadedFiles
            .AnyAsync(f => f.FileStorageHash == hash && f.FileSeq != fileSeq, cancellationToken);

        // Known limitation: this delete is not transactional across DB and storage. If the
        // storage delete below succeeds but SaveChangesAsync afterwards fails (or vice versa),
        // we end up with either a DB row pointing at missing storage or an orphan blob/file.
        // A proper fix would require a transactional outbox or a soft-delete + janitor job;
        // documented under "Known limitations" in the bachelor report.
        if (!hashStillReferenced)
        {
            try
            {
                if (isLocal)
                {
                    await _localFileStorageService.DeleteFileAsync(hash, cancellationToken);
                }
                else
                {
                    await _fileStorageService.DeleteFileAsync(hash, cancellationToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "DeleteUploadedFileAsync: Failed to delete underlying storage for hash={Hash}, fileSeq={FileSeq}, isLocal={IsLocal}. Manual cleanup may be required.",
                    hash, fileSeq, isLocal);
                throw;
            }
        }

        _dbContext.UploadedFiles.Remove(file);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<UploadedFileDownload> GetUploadedFileForDownloadAsync(
        int fileSeq,
        string entraIdObjectId,
        CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.EntraIdObjectId == entraIdObjectId, cancellationToken)
            ?? throw new UnauthorizedAccessException("User not found");

        // Same enumeration-safe pattern as DeleteUploadedFileAsync: row missing and row in
        // another company both surface as 404 at the controller.
        var file = await _dbContext.UploadedFiles
            .FirstOrDefaultAsync(f => f.FileSeq == fileSeq && f.CompanySeq == user.CompanySeq, cancellationToken)
            ?? throw new KeyNotFoundException($"File {fileSeq} not found");

        Stream content;
        try
        {
            content = file.LocalStorage
                ? await _localFileStorageService.GetFileAsync(file.FileStorageHash, cancellationToken)
                : await _fileStorageService.GetFileAsync(file.FileStorageHash, cancellationToken);
        }
        catch (FileNotFoundException ex)
        {
            _logger.LogWarning(
                ex,
                "GetUploadedFileForDownloadAsync: storage missing for fileSeq={FileSeq}, hash={Hash}, isLocal={IsLocal}. DB and storage are out of sync.",
                file.FileSeq, file.FileStorageHash, file.LocalStorage);
            throw;
        }

        return new UploadedFileDownload(
            content,
            file.OriginalFileName,
            FileTypeMimeMap.ToContentType(file.FileType));
    }

    public async Task<UploadedFileResponse> MarkUploadedFileMappedAsync(
        int fileSeq,
        int interfaceSeq,
        string entraIdObjectId,
        CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.EntraIdObjectId == entraIdObjectId, cancellationToken) ?? throw new UnauthorizedAccessException("User not found");

        var file = await _dbContext.UploadedFiles.Include(f => f.UploadedByUser).FirstOrDefaultAsync(
            f => f.FileSeq == fileSeq && f.CompanySeq == user.CompanySeq,
            cancellationToken
        ) ?? throw new KeyNotFoundException($"File {fileSeq} not found");

        var interfaceExists = await _dbContext.Interfaces.AnyAsync(i => i.InterfaceSeq == interfaceSeq, cancellationToken);
        if (!interfaceExists)
        {
            throw new ArgumentException($"Interface {interfaceSeq} not found");
        }

        file.InterfaceSeq = interfaceSeq;
        file.IsMapped = true;
        file.StatusSeq = 1;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UploadedFileResponse
        {
            FileSeq = file.FileSeq,
            OriginalFileName = file.OriginalFileName,
            FileType = file.FileType,
            FileSize = file.FileSize,
            FileUploadedAt = file.FileUploadedAt,
            UploadedByUserName = file.UploadedByUser.UserName,
            IsMapped = file.IsMapped,
            InterfaceSeq = file.InterfaceSeq,
            StatusSeq = file.StatusSeq,
            LocalStorage = file.LocalStorage,
        };
    }
}