namespace WebAPI.DTOs.Responses;

public class ApprovedColumnLanguageValuesResponse
{
    public string LanguageCode { get; set; } = "";
    public List<string> Values { get; set; } = [];
}