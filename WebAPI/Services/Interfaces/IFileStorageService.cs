public interface IFileStorageService
{
    Task<string> SaveFileAsync(Stream fileStream, CancellationToken cancellationToken = default);
    Task<Stream> GetFileAsync(string hash, CancellationToken cancellationToken = default);
    Task DeleteFileAsync(string hash, CancellationToken cancellationToken = default);
}