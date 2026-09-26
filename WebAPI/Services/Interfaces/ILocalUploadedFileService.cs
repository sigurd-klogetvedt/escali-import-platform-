using WebAPI.DTOs.Responses;

public interface ILocalUploadedFileService
{
    Task<UploadedFileResponse> UploadFileAsync(IFormFile file, string entraIdObjectId, CancellationToken cancellationToken = default);
}