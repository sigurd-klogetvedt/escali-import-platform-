namespace WebAPI.Models;

public class User
{
    public int UserSeq { get; set; }
    public int CompanySeq { get; set; }
    public string? EntraIdObjectId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public bool IsAdmin { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public DateTime UserCreated { get; set; }
    public DateTime UserUpdated { get; set; }
    public String Permissions { get; set; } = "User";

    public Company Company { get; set; } = null!;
}
