namespace WebAPI.DTOs.Responses;

public class MappingTemplateColumnResponse
{
    public int TemplateColumnSeq { get; set; }
    public string OriginalColumn { get; set; } = string.Empty;
    public int TargetColumnSeq { get; set; }
}