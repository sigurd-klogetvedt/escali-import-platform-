using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.DTOs.Responses;
using WebAPI.Services.Interfaces;

namespace WebAPI.Services.Implementations;

public class StatusService : IStatusService
{
    private readonly ApplicationDbContext _dbContext;

    public StatusService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<StatusResponse>> GetStatusesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Statuses.OrderBy(s => s.StatusSeq).Select(s => new StatusResponse
        {
            StatusSeq = s.StatusSeq,
            StatusName = s.StatusName
        }).ToListAsync(cancellationToken);
    }
}