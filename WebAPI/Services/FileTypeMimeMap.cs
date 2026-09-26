using WebAPI.Models.Enums;

namespace WebAPI.Services;

public static class FileTypeMimeMap
{
    public static string ToContentType(FileType fileType) => fileType switch
    {
        FileType.csv => "text/csv",
        FileType.xlsx => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        _ => "application/octet-stream",
    };
}
