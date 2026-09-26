using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs.Requests;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadFilesController : ControllerBase
{
    private readonly IUploadedFileService _uploadedFileService;
    private readonly ILogger<UploadFilesController> _logger;
    private readonly IFilePreviewService _filePreviewService;

    public UploadFilesController(IUploadedFileService uploadedFileService, ILogger<UploadFilesController> logger, IFilePreviewService filePreviewService)
    {
        _uploadedFileService = uploadedFileService;
        _logger = logger;
        _filePreviewService = filePreviewService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] GetUploadedFilesQuery query,
        CancellationToken cancellationToken = default)
    {
        var entraId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;

        if (string.IsNullOrEmpty(entraId))
        {
            return Unauthorized();
        }

        query ??= new GetUploadedFilesQuery();

        var files = await _uploadedFileService.GetUploadedFilesAsync(entraId, query, cancellationToken);

        return Ok(files);
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

    [HttpPost("upload")]
    [RequestSizeLimit(1024 * 1024 * 10)] // 10 MB limit
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("Upload: BadRequest - no file or empty file");
            return BadRequest("No file was uploaded");
        }

        var entraId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;

        if (string.IsNullOrEmpty(entraId))
        {
            _logger.LogWarning("Upload: Unauthorized - no EntraId in claims for file {FileName}", file.FileName);
            return Unauthorized();
        }

        _logger.LogInformation("Upload: Processing file {FileName}, Size={Size} bytes", file.FileName, file.Length);

        try
        {
            var result = await _uploadedFileService.UploadFileAsync(file, entraId);

            if (result == null || result.FileSeq == 0)
            {
                _logger.LogWarning("Upload: Service returned null or FileSeq=0 for {FileName}", file.FileName);
                return BadRequest("Failed to upload file");
            }

            _logger.LogInformation("Upload: Success - {FileName} saved as FileSeq={FileSeq}", file.FileName, result.FileSeq);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(ex, "Upload: User not found for entraId={EntraId}, file={FileName}", entraId, file.FileName);
            return Unauthorized();
        }
        catch (ArgumentException ex)
        {
            _logger.LogError(ex, "Upload: Invalid file type for {FileName}", file.FileName);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Upload: Unexpected error for {FileName}: {Message}", file.FileName, ex.Message);
            return StatusCode(500, "An error occurred while uploading the file");
        }
    }

    [HttpGet("{fileSeq:int}/download")]
    public async Task<IActionResult> Download(int fileSeq, CancellationToken cancellationToken = default)
    {
        var entraId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;

        if (string.IsNullOrEmpty(entraId))
        {
            _logger.LogWarning("Download: Unauthorized - no EntraId in claims for fileSeq={FileSeq}", fileSeq);
            return Unauthorized();
        }

        try
        {
            var download = await _uploadedFileService.GetUploadedFileForDownloadAsync(fileSeq, entraId, cancellationToken);

            Response.Headers["Cache-Control"] = "no-store";
            Response.Headers["X-Content-Type-Options"] = "nosniff";

            return new FileStreamResult(download.Content, download.ContentType)
            {
                FileDownloadName = download.FileName,
            };
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(ex, "Download: User not found for entraId={EntraId}, fileSeq={FileSeq}", entraId, fileSeq);
            return Unauthorized();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (FileNotFoundException)
        {
            // Storage drift is already logged as a warning in the service layer.
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Download: Unexpected error for fileSeq={FileSeq}: {Message}", fileSeq, ex.Message);
            return StatusCode(500, "An error occurred while downloading the file");
        }
    }

    [HttpDelete("{fileSeq:int}")]
    public async Task<IActionResult> Delete(int fileSeq, CancellationToken cancellationToken = default)
    {
        var entraId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;

        if (string.IsNullOrEmpty(entraId))
        {
            _logger.LogWarning("Delete: Unauthorized - no EntraId in claims for fileSeq={FileSeq}", fileSeq);
            return Unauthorized();
        }

        try
        {
            await _uploadedFileService.DeleteUploadedFileAsync(fileSeq, entraId, cancellationToken);
            _logger.LogInformation("Delete: Removed FileSeq={FileSeq} for entraId={EntraId}", fileSeq, entraId);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(ex, "Delete: User not found for entraId={EntraId}, fileSeq={FileSeq}", entraId, fileSeq);
            return Unauthorized();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Delete: Unexpected error for fileSeq={FileSeq}: {Message}", fileSeq, ex.Message);
            return StatusCode(500, "An error occurred while deleting the file");
        }
    }

    [HttpPatch("{fileSeq:int}/mapping")]
    public async Task<IActionResult> MarkMapped(
        int fileSeq,
        [FromBody] MapUploadedFileRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request is null)
        {
            return BadRequest("Request body is required");
        }

        var entraId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;

        if (string.IsNullOrEmpty(entraId))
        {
            _logger.LogWarning("MarkMapped: Unauthorized - no EntraID in claims for fileSeq={FileSeq}", fileSeq);
            return Unauthorized();
        }

        try
        {
            var result = await _uploadedFileService.MarkUploadedFileMappedAsync(
                fileSeq,
                request.InterfaceSeq,
                entraId,
                cancellationToken);
            _logger.LogInformation(
                "MarkMapped: FileSeq={FileSeq} mapped to InterfaceSeq={InterfaceSeq} by entraId={EntraId}",
                fileSeq, request.InterfaceSeq, entraId);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(ex, "MarkMapped: User not found for entraId={EntraId}, fileSeq={FileSeq}", entraId, fileSeq);
            return Unauthorized();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "MarkMapped: Bad request for fileSeq={FileSeq}: {Message}", fileSeq, ex.Message);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "MarkMapped: Unexpected error for fileSeq={FileSeq}: {Message}", fileSeq, ex.Message);
            return StatusCode(500, "An error occurred while updating the file mapping");
        }
    }
}