using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LocalUploadFilesController : ControllerBase
{
    private readonly ILocalUploadedFileService _localUploadedFileService;
    private readonly IFilePreviewService _filePreviewService;
    private readonly ILogger<LocalUploadFilesController> _logger;

    public LocalUploadFilesController(ILocalUploadedFileService localUploadedFileService, IFilePreviewService filePreviewService, ILogger<LocalUploadFilesController> logger)
    {
        _localUploadedFileService = localUploadedFileService;
        _filePreviewService = filePreviewService;
        _logger = logger;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(1024 * 1024 * 10)]
    public async Task<IActionResult> UploadLocal(IFormFile file, CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0) return BadRequest("No file was uploaded.");

        var entraId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
        if (string.IsNullOrEmpty(entraId)) return Unauthorized();

        try
        {
            var result = await _localUploadedFileService.UploadFileAsync(file, entraId, cancellationToken);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Local upload failed for {FileName}", file.FileName);
            return StatusCode(500, "An error occurred while uploading the file");
        }
    }

    [HttpGet("{fileSeq}/preview")]
    public async Task<IActionResult> GetPreview(int fileSeq, CancellationToken cancellationToken = default)
    {
        var entraId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
        if (string.IsNullOrEmpty(entraId))
        {
            return Unauthorized();
        }

        try
        {
            var preview = await _filePreviewService.GetFilePreviewAsync(fileSeq, entraId, cancellationToken);
            return Ok(preview);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}