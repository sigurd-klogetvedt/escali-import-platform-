using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs.Requests;

public class CreateMappingTemplateRequest
{
    [Required, MaxLength(255)]
    public string TemplateName { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int InterfaceSeq { get; set; }

    [Required, MinLength(1)]
    public List<CreateMappingTemplateColumnRequest> ColumnMapping { get; set; } = new();
}