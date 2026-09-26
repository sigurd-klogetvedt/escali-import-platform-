namespace WebAPI.Models;

public class Interface
{
    public int InterfaceSeq { get; set; }
    public string InterfaceName { get; set; } = null!;
    public DateTime InterfaceCreatedAt { get; set; }
    public DateTime InterfaceUpdatedAt { get; set; }

    // Navigation
    public ICollection<Column> Columns { get; set; } = new List<Column>();
}