using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs.Requests;

public class UpdateUserRequest
{
    [MaxLength(255)]
    public string? DisplayName { get; set; }

    public bool? IsAdmin { get; set; }

    public bool? IsActive { get; set; }
}
