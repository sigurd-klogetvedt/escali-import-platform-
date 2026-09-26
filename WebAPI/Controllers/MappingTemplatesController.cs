using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs.Requests;
using WebAPI.Services.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ReadWrite")]
public class MappingTemplatesController : ControllerBase
{
    private readonly IMappingTemplateService _mappingTemplateService;
    private readonly ILogger<MappingTemplatesController> _logger;

    public MappingTemplatesController(IMappingTemplateService mappingTemplateService, ILogger<MappingTemplatesController> logger)
    {
        _mappingTemplateService = mappingTemplateService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> ListByInterface([FromQuery] int interfaceSeq, CancellationToken cancellationToken)
    {
        if (interfaceSeq <= 0)
            return BadRequest();

        var companySeqClaim = User.FindFirst("db_company_id")?.Value;
        if (companySeqClaim is null || !int.TryParse(companySeqClaim, out var companySeq))
            return Unauthorized();

        var list = await _mappingTemplateService.ListByInterfaceAsync(interfaceSeq, companySeq, cancellationToken);
        return Ok(list);
    } 

    [HttpGet("{templateSeq:int}")]
    public async Task<IActionResult> GetById(int templateSeq, CancellationToken cancellationToken)
    {
        var companySeqClaim = User.FindFirst("db_company_id")?.Value;
        if (companySeqClaim is null || !int.TryParse(companySeqClaim, out var companySeq))
            return Unauthorized();

        var result = await _mappingTemplateService.GetByIdAsync(templateSeq, companySeq, cancellationToken);
        if (result is null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMappingTemplateRequest request, CancellationToken cancellationToken)
    {
        var companySeqClaim = User.FindFirst("db_company_id")?.Value;
        var userSeqClaim = User.FindFirst("db_user_id")?.Value;
        if (companySeqClaim is null || userSeqClaim is null ||
            !int.TryParse(companySeqClaim, out var companySeq) ||
            !int.TryParse(userSeqClaim, out var userSeq))
            return Unauthorized();
        try
        {
            var result = await _mappingTemplateService.CreateAsync(request, companySeq, userSeq, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { templateSeq = result.TemplateSeq }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create mapping template");
            return StatusCode(500, new { message = "An error occurred while creating the mapping template." });
        }
    }
}