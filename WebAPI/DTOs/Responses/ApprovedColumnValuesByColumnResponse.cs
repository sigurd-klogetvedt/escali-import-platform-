namespace WebAPI.DTOs.Responses;

public class ApprovedColumnValuesByColumnResponse
{
    public int ColumnSeq { get; set; }

    /// <summary>Verider er i ISO 639-1 koder (altså "no", "en", osv.). Verdier er sortert alfabetisk etter Value.</summary>
    public List<ApprovedColumnLanguageValuesResponse> ByLanguage { get; set; } = [];
}