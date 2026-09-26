using WebAPI.DTOs.Responses;

namespace WebAPI.Services.Interfaces;

public interface IStatusService
{
    Task<List<StatusResponse>> GetStatusesAsync(CancellationToken cancellationToken = default);
}