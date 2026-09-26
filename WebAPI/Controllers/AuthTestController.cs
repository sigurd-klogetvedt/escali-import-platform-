using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthTestController : ControllerBase
{
    // Intentionally public - used to verify that the auth pipeline
    // distinguishes between public and protected endpoints. Must not return
    // any data beyond a trivial static message.
    [HttpGet("public")]
    public IActionResult Public()
    {
        return Ok(new { message = "This is a public endpoint" });
    }

    [Authorize(Policy = "ValidUser")]
    [HttpGet("protected")]
    public IActionResult Protected([FromServices] IWebHostEnvironment env)
    {
        var result = new
        {
            message = "You are authenticated and validated!",
            entraObjectId = User.FindFirst("oid")?.Value
                            ?? User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value,
            email = User.FindFirst("preferred_username")?.Value
                    ?? User.FindFirst("upn")?.Value
                    ?? User.FindFirst("email")?.Value,
            tenantId = User.FindFirst("tid")?.Value
                       ?? User.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid")?.Value,
            dbUserId = User.FindFirst("db_user_id")?.Value,
            dbCompanyId = User.FindFirst("db_company_id")?.Value,
            isAdmin = User.FindFirst("db_is_admin")?.Value,
        };

        if (env.IsDevelopment())
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(new
            {
                result.message,
                result.entraObjectId,
                result.email,
                result.tenantId,
                result.dbUserId,
                result.dbCompanyId,
                result.isAdmin,
                allClaims = claims
            });
        }

        return Ok(result);
    }

    [Authorize(Policy = "Admin")]
    [HttpGet("admin")]
    public IActionResult Admin()
    {
        return Ok(new { message = "You have admin access" });
    }
}
