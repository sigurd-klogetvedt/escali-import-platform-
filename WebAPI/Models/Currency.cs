namespace WebAPI.Models;

public class Currency
{
    public int CurrencySeq { get; set; }
    public string CurrencyName { get; set; } = null!;
    public string CurrencyCode { get; set; } = null!;
}
