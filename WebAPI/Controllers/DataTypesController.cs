using Microsoft.AspNetCore.Mvc;
using WebAPI.Services.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DataTypesController : ControllerBase
{
    private readonly IDataTypeService _dataTypeService;
    private readonly ILogger<DataTypesController> _logger;

    public DataTypesController(IDataTypeService dataTypeService, ILogger<DataTypesController> logger)
    {
        _dataTypeService = dataTypeService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetDataTypes(CancellationToken cancellationToken)
    {
        var dataTypes = await _dataTypeService.GetDataTypesAsync(cancellationToken);
        return Ok(dataTypes);
    }
}