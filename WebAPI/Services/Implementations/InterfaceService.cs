using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.DTOs.Responses;
using WebAPI.Services.Interfaces;

namespace WebAPI.Services.Implementations;

public class InterfaceService : IInterfaceService
{
    private readonly ApplicationDbContext _dbContext;

    public InterfaceService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<InterfaceResponse>> GetInterfacesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Interfaces.OrderBy(i => i.InterfaceSeq).Select(i => new InterfaceResponse
        {
            InterfaceSeq = i.InterfaceSeq,
            InterfaceName = i.InterfaceName,
            InterfaceCreatedAt = i.InterfaceCreatedAt,
            InterfaceUpdatedAt = i.InterfaceUpdatedAt
        }).ToListAsync(cancellationToken);
    }

    public async Task<List<ColumnResponse>> GetColumnsAsync(int? interfaceSeq = null, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Columns.AsQueryable();

        if (interfaceSeq.HasValue)
            query = query.Where(c => c.InterfaceSeq == interfaceSeq.Value);

        return await query.OrderBy(c => c.InterfaceSeq).ThenBy(c => c.ColumnSeq).Select(c => new ColumnResponse
        {
            ColumnSeq = c.ColumnSeq,
            InterfaceSeq = c.InterfaceSeq,
            ColumnFieldName = c.ColumnFieldName,
            DataTypeSeq = c.DataTypeSeq,
            DataType = c.DataType.Type,
            ColumnRequired = c.ColumnRequired,
            ColumnNeedsApprovedValues = c.ColumnNeedsApprovedValues,
            ColumnFieldDescriptions = c.ColumnFieldDescriptions.OrderBy(d => d.LanguageCode).ThenBy(d => d.Value).Select(d => new ColumnFieldDescriptionResponse
            {
                LanguageCode = d.LanguageCode,
                Value = d.Value
            }).ToList()
        }).ToListAsync(cancellationToken);
    }
}