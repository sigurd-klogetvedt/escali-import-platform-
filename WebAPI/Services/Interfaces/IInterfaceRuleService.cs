using WebAPI.DTOs.Responses;

namespace WebAPI.Services.Interfaces;

public interface IInterfaceRuleService
{
    Task<List<InterfaceRuleResponse>> GetInterfaceRulesAsync(
        int interfaceSeq,
        CancellationToken cancellationToken = default
    );
}