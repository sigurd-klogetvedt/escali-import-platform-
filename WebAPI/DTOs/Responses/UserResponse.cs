namespace WebAPI.DTOs.Responses;

public class UserResponse
{
    public int UserSeq { get; set; }
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime UserCreated { get; set; }
}
