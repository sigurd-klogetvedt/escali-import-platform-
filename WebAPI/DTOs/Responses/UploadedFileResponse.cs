using System.Text.Json.Serialization;
using WebAPI.Models.Enums;

public class UploadedFileResponse
{
    public int FileSeq { get; set; }
    public string OriginalFileName { get; set; } = "";

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public FileType FileType { get; set; }
    public float FileSize { get; set; }
    public DateTime FileUploadedAt { get; set; }
    public string UploadedByUserName { get; set; } = "";
    public bool IsMapped { get; set; }
    public int? InterfaceSeq { get; set; }
    public int? StatusSeq { get; set; }
    public bool LocalStorage { get; set; }
}