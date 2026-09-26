using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.DTOs.Responses;
using WebAPI.Services.Interfaces;

namespace WebAPI.Services.Implementations;

public class InterfaceRuleService : IInterfaceRuleService
{
    private readonly ApplicationDbContext _dbContext;

    public InterfaceRuleService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<InterfaceRuleResponse>> GetInterfaceRulesAsync(int interfaceSeq, CancellationToken cancellationToken = default)
    {
        return await _dbContext.InterfaceRules.AsNoTracking().Where(r => r.InterfaceSeq == interfaceSeq).OrderBy(r => r.RuleSeq).Select(r => new InterfaceRuleResponse
        {
            RuleSeq = r.RuleSeq,
            InterfaceSeq = r.InterfaceSeq,
            RuleTypeCode = r.RuleTypeCode,
            RuleName = r.RuleName,
            RuleCombinations = r.RuleCombinations.OrderBy(c => c.CombinationSeq).Select(c => new RuleCombinationResponse
            {
                CombinationSeq = c.CombinationSeq,
                Members = c.RuleCombinationMembers.OrderBy(m => m.MemberSeq).Select(m => new RuleCombinationMemberResponse
                {
                    MemberSeq = m.MemberSeq,
                    ColumnSeq = m.ColumnSeq,
                    ColumnFieldName = m.Column.ColumnFieldName
                }).ToList()
            }).ToList()
        }).ToListAsync(cancellationToken);
    }
}