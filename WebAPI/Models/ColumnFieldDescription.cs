namespace WebAPI.Models;

public class ColumnFieldDescription
{
    public int FieldDescriptionSeq { get; set; }
    public int ColumnSeq { get; set; }
    public Column Column { get; set; } = null!;
    public string LanguageCode { get; set; } = null!;
    public string Value { get; set; } = null!;
}