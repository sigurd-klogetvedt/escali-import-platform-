namespace WebAPI.Models;

public class DataType
{
    public int DataTypeSeq { get; set; }
    public string Type { get; set; } = null!;
    public ICollection<Column> Columns { get; set; } = new List<Column>();
}