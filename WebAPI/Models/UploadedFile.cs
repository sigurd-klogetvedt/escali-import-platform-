using WebAPI.Models.Enums;

namespace WebAPI.Models;

public class UploadedFile
{
    public int FileSeq { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string FileStorageHash { get; set; } = string.Empty;
    public FileType FileType { get; set; }
    public float FileSize { get; set; }
    public int UploadedByUserSeq { get; set; }
    public int CompanySeq { get; set; }
    public DateTime FileUploadedAt { get; set; }
    public bool IsMapped { get; set; } = false;
    public int? InterfaceSeq { get; set; }
    public Interface? Interface { get; set; }

    public int? StatusSeq { get; set; }
    public Status? Status { get; set; }

    public User UploadedByUser { get; set; } = null!;
    public Company Company { get; set; } = null!;
    public bool LocalStorage { get; set; } = false;
}