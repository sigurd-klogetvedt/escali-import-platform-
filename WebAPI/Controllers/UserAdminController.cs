using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.DTOs.Requests;
using WebAPI.DTOs.Responses;
using WebAPI.Models;

namespace WebAPI.Controllers;

/// <summary>
/// Admin-only API for managing users within the admin's own company.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "Admin")]
public class UserAdminController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public UserAdminController(ApplicationDbContext db)
    {
        _db = db;
    }

    private int GetCompanySeq() =>
        int.Parse(User.FindFirst("db_company_id")!.Value);

    private static UserResponse MapToResponse(User user) => new()
    {
        UserSeq = user.UserSeq,
        Email = user.UserEmail,
        DisplayName = user.UserName,
        IsAdmin = user.IsAdmin,
        IsActive = user.IsActive,
        LastLoginAt = user.LastLoginAt,
        UserCreated = user.UserCreated,
    };

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var companySeq = GetCompanySeq();

        var users = (await _db.Users
            .Where(u => u.CompanySeq == companySeq)
            .OrderBy(u => u.UserEmail)
            .ToListAsync())
            .Select(MapToResponse);

        return Ok(users);
    }

    [HttpGet("users/{userSeq:int}")]
    public async Task<IActionResult> GetUser(int userSeq)
    {
        var companySeq = GetCompanySeq();

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.UserSeq == userSeq && u.CompanySeq == companySeq);

        if (user is null)
            return NotFound();

        return Ok(MapToResponse(user));
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        var companySeq = GetCompanySeq();
        var normalizedEmail = request.Email.ToLowerInvariant();

        var exists = await _db.Users.AnyAsync(u => u.UserEmail == normalizedEmail);
        if (exists)
            return Conflict(new { message = "A user with this email already exists" });

        var now = DateTime.UtcNow;

        var user = new User
        {
            CompanySeq = companySeq,
            UserEmail = normalizedEmail,
            UserName = request.DisplayName,
            IsAdmin = request.IsAdmin,
            IsActive = true,
            UserCreated = now,
            UserUpdated = now,
        };

        _db.Users.Add(user);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "A user with this email already exists" });
        }

        return CreatedAtAction(nameof(GetUser), new { userSeq = user.UserSeq }, MapToResponse(user));
    }

    [HttpPut("users/{userSeq:int}")]
    public async Task<IActionResult> UpdateUser(int userSeq, [FromBody] UpdateUserRequest request)
    {
        var companySeq = GetCompanySeq();

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.UserSeq == userSeq && u.CompanySeq == companySeq);

        if (user is null)
            return NotFound();

        if (request.DisplayName is not null)
            user.UserName = request.DisplayName;

        if (request.IsAdmin.HasValue)
            user.IsAdmin = request.IsAdmin.Value;

        if (request.IsActive.HasValue)
            user.IsActive = request.IsActive.Value;

        user.UserUpdated = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(MapToResponse(user));
    }

    [HttpDelete("users/{userSeq:int}")]
    public async Task<IActionResult> DeactivateUser(int userSeq)
    {
        var companySeq = GetCompanySeq();
        var currentUserId = int.Parse(User.FindFirst("db_user_id")!.Value);

        if (userSeq == currentUserId)
            return BadRequest(new { message = "You cannot deactivate yourself" });

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.UserSeq == userSeq && u.CompanySeq == companySeq);

        if (user is null)
            return NotFound();

        user.IsActive = false;
        user.UserUpdated = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return NoContent();
    }
}
