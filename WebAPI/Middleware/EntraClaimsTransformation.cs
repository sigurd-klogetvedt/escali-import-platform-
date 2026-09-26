using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using WebAPI.Services.Interfaces;

namespace WebAPI.Middleware;

/// <summary>
/// Transforms incoming Entra ID claims by validating the user against the database
/// and adding custom claims (isAdmin, permission, companyId, userId).
/// Runs after JWT validation on every authenticated request.
/// </summary>
public class EntraClaimsTransformation : IClaimsTransformation
{
    private readonly IUserValidationService _userValidationService;
    private readonly ILogger<EntraClaimsTransformation> _logger;

    public EntraClaimsTransformation(
        IUserValidationService userValidationService,
        ILogger<EntraClaimsTransformation> logger)
    {
        _userValidationService = userValidationService;
        _logger = logger;
    }

    public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity?.IsAuthenticated != true)
            return principal;

        if (principal.HasClaim(c => c.Type == "db_validated"))
            return principal;

        var objectId = principal.FindFirstValue("oid")
                      ?? principal.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
        var email = principal.FindFirstValue("preferred_username")
                   ?? principal.FindFirstValue("upn")
                   ?? principal.FindFirstValue("email")
                   ?? principal.FindFirstValue(ClaimTypes.Email)
                   ?? principal.FindFirstValue(ClaimTypes.Upn);
        var displayName = principal.FindFirstValue("name")
                         ?? principal.FindFirstValue(ClaimTypes.Name)
                         ?? "";
        var tenantId = principal.FindFirstValue("tid")
                      ?? principal.FindFirstValue("http://schemas.microsoft.com/identity/claims/tenantid")
                      ?? "";

        if (string.IsNullOrEmpty(objectId) || string.IsNullOrEmpty(email))
        {
            _logger.LogWarning("Missing objectId or email in token claims");
            return principal;
        }

        var user = await _userValidationService.ValidateAndGetUserAsync(
            objectId, email, displayName, tenantId);

        if (user is null)
        {
            _logger.LogWarning("User {Email} failed database validation", email);
            return principal;
        }

        var customIdentity = new ClaimsIdentity(
        [
            new Claim("db_validated", "true"),
            new Claim("db_user_id", user.UserSeq.ToString()),
            new Claim("db_company_id", user.CompanySeq.ToString()),
            new Claim("db_is_admin", user.IsAdmin.ToString().ToLowerInvariant()),
            new Claim("db_permission", user.Permissions),
        ], "DatabaseValidation");

        principal.AddIdentity(customIdentity);

        return principal;
    }
}
