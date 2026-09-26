namespace WebAPI.DTOs.Responses;

public class InterfaceResponse
{
    public int InterfaceSeq { get; set; }
    public string InterfaceName { get; set; } = "";
    public DateTime InterfaceCreatedAt { get; set; }
    public DateTime InterfaceUpdatedAt { get; set; }
}