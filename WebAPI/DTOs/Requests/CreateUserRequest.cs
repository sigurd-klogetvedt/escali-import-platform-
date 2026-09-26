using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs.Requests;

public class CreateUserRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string DisplayName { get; set; } = string.Empty;

    public bool IsAdmin { get; set; } = false;
}
