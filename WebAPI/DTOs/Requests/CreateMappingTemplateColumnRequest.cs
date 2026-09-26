using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs.Requests;

public class CreateMappingTemplateColumnRequest
{
    [Required, MaxLength(255)]
    public string OriginalColumn { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int TargetColumnSeq { get; set; }
}