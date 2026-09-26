using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs.Requests;

public class MapUploadedFileRequest
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "InterfaceSeq must be a positive integer.")]
    public int InterfaceSeq { get; set; }
}