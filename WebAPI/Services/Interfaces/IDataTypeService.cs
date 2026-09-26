using WebAPI.DTOs.Responses;

namespace WebAPI.Services.Interfaces;

public interface IDataTypeService
{
    Task<List<DataTypeResponse>> GetDataTypesAsync(CancellationToken cancellationToken = default);
}