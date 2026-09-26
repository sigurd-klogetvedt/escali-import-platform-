using System.Text.Json.Serialization;
using WebAPI.Models.Enums;

namespace WebAPI.DTOs.Responses;

public class ColumnResponse
{
    public int ColumnSeq { get; set; }
    public int InterfaceSeq { get; set; }
    public string ColumnFieldName { get; set; } = "";

    public int DataTypeSeq { get; set; }
    public string DataType { get; set; } = "";
    public bool ColumnRequired { get; set; }
    public bool ColumnNeedsApprovedValues { get; set; }
    public List<ColumnFieldDescriptionResponse> ColumnFieldDescriptions { get; set; } = new();
}