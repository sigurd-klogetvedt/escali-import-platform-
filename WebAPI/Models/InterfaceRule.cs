using WebAPI.Models.Enums;

namespace WebAPI.Models;

public class InterfaceRule
{
    public int RuleSeq { get; set; }
    public int InterfaceSeq { get; set; }
    public Interface Interface { get; set; } = null!;
    public RuleTypeCode RuleTypeCode { get; set; }
    public string RuleName { get; set; } = null!;
    public ICollection<RuleCombination> RuleCombinations { get; set; } = new List<RuleCombination>();
}