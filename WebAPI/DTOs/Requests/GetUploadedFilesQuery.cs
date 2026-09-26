namespace WebAPI.DTOs.Requests;

public class GetUploadedFilesQuery
{
    public bool IncludeCompanyFiles { get; set; } = false;
    public int? CompanySeq { get; set; }
    // /api/UploadedFiles?statusSeq=1&statusSeq=2
    public List<int>? StatusSeq { get; set; }

    // /api/UploadedFiles?interfaceSeq=10&interfaceSeq=12
    public List<int>? InterfaceSeq { get; set; }

    // Skalerbar, så her kan nye filter legges til.
}