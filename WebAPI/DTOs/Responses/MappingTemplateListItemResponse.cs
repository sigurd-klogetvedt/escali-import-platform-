namespace WebAPI.DTOs.Responses;

public class MappingTemplateListItemResponse
{
    public int TemplateSeq { get; set; }
    public string TemplateName { get; set; } = string.Empty;
    public int InterfaceSeq { get; set; }
    public DateTime TemplateCreatedAt { get; set; }
}