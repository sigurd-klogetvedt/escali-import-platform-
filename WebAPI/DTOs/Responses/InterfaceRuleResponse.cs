using System.Text.Json.Serialization;
using WebAPI.Models.Enums;

namespace WebAPI.DTOs.Responses;

public class InterfaceRuleResponse
{
    public int RuleSeq { get; set; }
    public int InterfaceSeq { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public RuleTypeCode RuleTypeCode { get; set; }

    public string RuleName { get; set; } = "";
    public List<RuleCombinationResponse> RuleCombinations { get; set; } = new();
}