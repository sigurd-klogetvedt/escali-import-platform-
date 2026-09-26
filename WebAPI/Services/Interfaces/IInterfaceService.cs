using WebAPI.DTOs.Responses;

namespace WebAPI.Services.Interfaces;

public interface IInterfaceService
{
    Task<List<InterfaceResponse>> GetInterfacesAsync(CancellationToken cancellationToken = default);
    Task<List<ColumnResponse>> GetColumnsAsync(int? interfaceSeq = null, CancellationToken cancellationToken = default);
}