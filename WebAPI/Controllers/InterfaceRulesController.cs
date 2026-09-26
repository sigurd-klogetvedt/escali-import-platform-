using Microsoft.AspNetCore.Mvc;
using WebAPI.Services.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InterfaceRulesController : ControllerBase
{
    private readonly IInterfaceRuleService _interfaceRuleService;

    public InterfaceRulesController(IInterfaceRuleService interfaceRuleService)
    {
        _interfaceRuleService = interfaceRuleService;
    }

    [HttpGet("{interfaceSeq:int}")]
    public async Task<IActionResult> GetByInterfaceSeq(int interfaceSeq, CancellationToken cancellationToken)
    {
        var rules = await _interfaceRuleService.GetInterfaceRulesAsync(interfaceSeq, cancellationToken);
        return Ok(rules);
    }
}