namespace WebAPI.Models;

public class Column
{
    public int ColumnSeq { get; set; }
    public int InterfaceSeq { get; set; }
    public Interface Interface { get; set; } = null!;
    public string ColumnFieldName { get; set; } = null!;
    public int DataTypeSeq { get; set; }
    public DataType DataType { get; set; } = null!;
    public bool ColumnRequired { get; set; } = false;
    public bool ColumnNeedsApprovedValues { get; set; } = false;
    public DateTime ColumnCreatedAt { get; set; }
    public DateTime ColumnUpdatedAt { get; set; }

    public ICollection<ColumnFieldDescription> ColumnFieldDescriptions { get; set; } = new List<ColumnFieldDescription>();
}