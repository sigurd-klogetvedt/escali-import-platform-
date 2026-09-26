using WebAPI.Models;

namespace WebAPI.Services.Interfaces;

public interface IUserValidationService
{
    /// <summary>
    /// Validates a user after Entra ID authentication.
    /// Checks domain, creates user if new, updates last login.
    /// Returns null if user is unauthorized.
    /// </summary>
    Task<User?> ValidateAndGetUserAsync(
        string entraObjectId,
        string email,
        string displayName,
        string tenantId);
}
