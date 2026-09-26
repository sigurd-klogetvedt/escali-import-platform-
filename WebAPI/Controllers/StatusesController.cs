using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Services.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StatusesController : ControllerBase
{
    private readonly IStatusService _statusService;

    public StatusesController(IStatusService statusService)
    {
        _statusService = statusService; 
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var statuses = await _statusService.GetStatusesAsync(cancellationToken);
        return Ok(statuses);
    }
}