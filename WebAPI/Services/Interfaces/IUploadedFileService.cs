using WebAPI.DTOs.Requests;
using WebAPI.DTOs.Responses;

public interface IUploadedFileService
{
    Task<UploadedFileResponse> UploadFileAsync(IFormFile file, string entraIdObjectId);
    Task<UploadedFilesResultResponse> GetUploadedFilesAsync(
        string entraIdObjectId,
        GetUploadedFilesQuery query,
        CancellationToken cancellationToken = default
    );
    Task DeleteUploadedFileAsync(
        int fileSeq,
        string entraIdObjectId,
        CancellationToken cancellationToken = default
    );

    Task<UploadedFileResponse> MarkUploadedFileMappedAsync(
        int fileSeq,
        int interfaceSeq,
        string entraIdObjectId,
        CancellationToken cancellationToken = default
    );

    Task<UploadedFileDownload> GetUploadedFileForDownloadAsync(
        int fileSeq,
        string entraIdObjectId,
        CancellationToken cancellationToken = default
    );
}