namespace WebAPI.Models;

public class RuleCombinationMember
{
    public int MemberSeq { get; set; }
    public int CombinationSeq { get; set; }
    public RuleCombination RuleCombination { get; set; } = null!;
    public int ColumnSeq { get; set; }
    public Column Column { get; set; } = null!;
}