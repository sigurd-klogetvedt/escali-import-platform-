namespace WebAPI.Models;

public class Company
{
    public int CompanySeq { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string? EntraTenantId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CompanyCreated { get; set; }
    public DateTime CompanyUpdated { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
}
