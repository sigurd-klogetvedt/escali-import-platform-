namespace WebAPI.DTOs.Responses;

public class RuleCombinationResponse
{
    public int CombinationSeq { get; set; }
    public List<RuleCombinationMemberResponse> Members { get; set; } = new();
}