namespace WebAPI.Models;

public class RuleCombination
{
    public int CombinationSeq { get; set; }
    public int RuleSeq { get; set; }
    public InterfaceRule InterfaceRule { get; set; } = null!;
    public ICollection<RuleCombinationMember> RuleCombinationMembers { get; set; } = new List<RuleCombinationMember>();
}