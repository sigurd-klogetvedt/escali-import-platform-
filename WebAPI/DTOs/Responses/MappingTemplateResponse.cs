namespace WebAPI.DTOs.Responses;

public class MappingTemplateResponse
{
    public int TemplateSeq { get; set; }
    public string TemplateName { get; set; } = string.Empty;
    public int InterfaceSeq { get; set; }
    public int CompanySeq { get; set; }
    public int CreatedByUserSeq { get; set; }
    public DateTime TemplateCreatedAt { get; set; }
    public List<MappingTemplateColumnResponse> ColumnMapping { get; set; } = new();
}