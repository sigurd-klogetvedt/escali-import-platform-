using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Services.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApprovedColumnValuesController : ControllerBase
{
    private readonly IApprovedColumnValuesService _approvedColumnValuesService;

    public ApprovedColumnValuesController(IApprovedColumnValuesService approvedColumnValuesService)
    {
        _approvedColumnValuesService = approvedColumnValuesService;
    }

    [HttpGet("column/{columnSeq:int}")]
    public async Task<IActionResult> GetByColumnSeq(int columnSeq, CancellationToken cancellationToken)
    {
        var result = await _approvedColumnValuesService.GetByColumnSeqAsync(columnSeq, cancellationToken);

        if (result is null)
            return NotFound();

        return Ok(result);
    }
}