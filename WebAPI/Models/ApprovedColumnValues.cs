namespace WebAPI.Models;

public class ApprovedColumnValues
{
    public int TranslationSeq { get; set; }
    public int ColumnSeq { get; set; }
    public Column Column { get; set; } = null!;
    public string LanguageCode { get; set; } = null!;
    public string Value { get; set; } = null!;
}