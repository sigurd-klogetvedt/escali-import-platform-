namespace WebAPI.Models;

public class MappingTemplateColumn
{
    public int TemplateColumnSeq { get; set; }
    public string OriginalColumn { get; set; } = null!;

    public int TargetColumnSeq { get; set; }
    public Column TargetColumn { get; set; } = null!;

    public int TemplateSeq { get; set; }
    public MappingTemplate Template { get; set; } = null!;
}