using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.Models;
using WebAPI.Services.Interfaces;

namespace WebAPI.Services.Implementations;

public class UserValidationService : IUserValidationService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<UserValidationService> _logger;

    public UserValidationService(ApplicationDbContext db, ILogger<UserValidationService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<User?> ValidateAndGetUserAsync(
        string entraObjectId,
        string email,
        string displayName,
        string tenantId)
    {
        var user = await _db.Users
            .Include(u => u.Company)
            .FirstOrDefaultAsync(u => u.UserEmail == email.ToLowerInvariant());

        if (user is null)
        {
            _logger.LogWarning("No pre-registered user found for {Email}", email);
            return null;
        }

        if (!user.IsActive)
        {
            _logger.LogWarning("User {Email} is inactive", email);
            return null;
        }

        if (!user.Company.IsActive)
        {
            _logger.LogWarning("Company {Company} is inactive for user {Email}", user.Company.CompanyName, email);
            return null;
        }

        var now = DateTime.UtcNow;
        var needsSave = false;

        // Tenant validation: store on first login, enforce on subsequent
        if (!string.IsNullOrEmpty(tenantId))
        {
            if (string.IsNullOrEmpty(user.Company.EntraTenantId))
            {
                user.Company.EntraTenantId = tenantId;
                user.Company.CompanyUpdated = now;
                needsSave = true;
                _logger.LogInformation(
                    "Stored TenantId {TenantId} for company {Company}",
                    tenantId, user.Company.CompanyName);
            }
            else if (user.Company.EntraTenantId != tenantId)
            {
                _logger.LogWarning(
                    "Tenant mismatch for user {Email}: expected {Expected}, got {Actual}",
                    email, user.Company.EntraTenantId, tenantId);
                return null;
            }
        }

        // Link Entra ObjectId on first login

        if (string.IsNullOrEmpty(user.EntraIdObjectId))
        {
            user.EntraIdObjectId = entraObjectId;
            needsSave = true;
            _logger.LogInformation("Linked EntraObjectId for user {Email}", email);
        }
        else if (user.EntraIdObjectId != entraObjectId)
        {
            _logger.LogWarning(
                "EntraObjectId mismatch for user {Email}: expected {Expected}, got {Actual}",
                email, user.EntraIdObjectId, entraObjectId);
            return null;
        }

        if (!string.IsNullOrWhiteSpace(displayName) && user.UserName != displayName)
        {
            user.UserName = displayName;
            needsSave = true;
        }

        // Only update LastLoginAt if it's been more than 5 minutes (avoids writes on every cached miss)
        if (user.LastLoginAt is null || now - user.LastLoginAt > TimeSpan.FromMinutes(5))
        {
            user.LastLoginAt = now;
            user.UserUpdated = now;
            needsSave = true;
        }

        if (needsSave)
            await _db.SaveChangesAsync();

        return user;
    }
}
