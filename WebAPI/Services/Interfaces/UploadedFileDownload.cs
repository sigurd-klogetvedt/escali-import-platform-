public sealed record UploadedFileDownload(
    Stream Content,
    string FileName,
    string ContentType
);
