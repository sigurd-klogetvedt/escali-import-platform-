namespace WebAPI.DTOs.Responses;

public class UploadedFilesResultResponse
{
    public int Count { get; set; }
    public List<UploadedFileResponse> Items { get; set; } = new();
}