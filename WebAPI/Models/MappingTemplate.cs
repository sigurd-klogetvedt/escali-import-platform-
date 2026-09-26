namespace WebAPI.Models;

public class MappingTemplate
{
    public int TemplateSeq { get; set; }
    public string TemplateName { get; set; } = null!;

    public int InterfaceSeq { get; set; }
    public Interface Interface { get; set; } = null!;

    public int CompanySeq { get; set; }
    public Company Company { get; set; } = null!;

    public int CreatedByUserSeq { get; set; }
    public User CreatedByUser { get; set; } = null!;

    public DateTime TemplateCreatedAt { get; set; }

    public ICollection<MappingTemplateColumn> ColumnMapping { get; set; } = new List<MappingTemplateColumn>();
}