namespace WebAPI.DTOs.Responses;

public class RuleCombinationMemberResponse
{
    public int MemberSeq { get; set; }
    public int ColumnSeq { get; set; }
    public string ColumnFieldName { get; set; } = "";
}