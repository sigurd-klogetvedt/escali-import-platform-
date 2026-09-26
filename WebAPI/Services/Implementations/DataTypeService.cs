using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.DTOs.Responses;
using WebAPI.Services.Interfaces;

namespace WebAPI.Services.Implementations;

public class DataTypeService : IDataTypeService
{
    private readonly ApplicationDbContext _dbContext;

    public DataTypeService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<DataTypeResponse>> GetDataTypesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.DataTypes.OrderBy(d => d.DataTypeSeq).Select(d => new DataTypeResponse
        {
            DataTypeSeq = d.DataTypeSeq,
            Type = d.Type
        }).ToListAsync(cancellationToken);
    }
}