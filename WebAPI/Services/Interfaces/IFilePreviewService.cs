public interface IFilePreviewService
{
    Task<FilePreviewResponse> GetFilePreviewAsync(int fileSeq, string entraObjectId, CancellationToken cancellationToken = default);
}