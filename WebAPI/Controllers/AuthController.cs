using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var isValidated = User.HasClaim("db_validated", "true");
        var hasPermission = User.HasClaim("db_is_admin", "true") ||
                            User.HasClaim("db_permission", "Admin") ||
                            User.HasClaim("db_permission", "User");

        if (!isValidated || !hasPermission)
        {
            return StatusCode(403, new
            {
                isValid = false,
                error = "User not registered in system or missing permissions"
            });
        }

        return Ok(new
        {
            isValid = true,
            userId = User.FindFirst("db_user_id")?.Value,
            companyId = User.FindFirst("db_company_id")?.Value,
            isAdmin = User.FindFirst("db_is_admin")?.Value == "true",
            permission = User.FindFirst("db_permission")?.Value,
            email = User.FindFirst("preferred_username")?.Value
                    ?? User.FindFirst("upn")?.Value
                    ?? User.FindFirst("email")?.Value,
        });
    }
}
