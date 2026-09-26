using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Services.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class InterfacesController : ControllerBase
{
    private readonly IInterfaceService _interfaceService;
    private readonly ILogger<InterfacesController> _logger;

    public InterfacesController(IInterfaceService interfaceService, ILogger<InterfacesController> logger)
    {
        _interfaceService = interfaceService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetInterfaces(CancellationToken cancellationToken)
    {
        var interfaces = await _interfaceService.GetInterfacesAsync(cancellationToken);

        var result = interfaces.Select(i => new
        {
            i.InterfaceSeq,
            i.InterfaceName
        });

        return Ok(result);
    }

    [HttpGet("columns")]
    public async Task<IActionResult> GetColumns([FromQuery] int? interfaceSeq, CancellationToken cancellationToken)
    {
        var columns = await _interfaceService.GetColumnsAsync(interfaceSeq, cancellationToken);
        return Ok(columns);
    }

    [HttpGet("{interfaceSeq:int}/columns")]
    public async Task<IActionResult> GetColumnsByInterface(int interfaceSeq, CancellationToken cancellationToken)
    {
        var columns = await _interfaceService.GetColumnsAsync(interfaceSeq, cancellationToken);
        return Ok(columns);
    }
}