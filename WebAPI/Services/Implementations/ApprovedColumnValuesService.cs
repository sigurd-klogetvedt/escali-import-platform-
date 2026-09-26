using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.DTOs.Responses;
using WebAPI.Services.Interfaces;

namespace WebAPI.Services.Implementations;

public class ApprovedColumnValuesService : IApprovedColumnValuesService
{
    private readonly ApplicationDbContext _dbContext;

    public ApprovedColumnValuesService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApprovedColumnValuesByColumnResponse?> GetByColumnSeqAsync(int columnSeq, CancellationToken cancellationToken = default)
    {
        var columnExists = await _dbContext.Columns.AnyAsync(c => c.ColumnSeq == columnSeq, cancellationToken);
        if (!columnExists)
            return null;

        var rows = await _dbContext.ApprovedColumnValues.Where(a => a.ColumnSeq == columnSeq).OrderBy(a => a.LanguageCode).ThenBy(a => a.Value).Select(a => new { a.LanguageCode, a.Value }).ToListAsync(cancellationToken);

        //var byLanguage = rows.GroupBy(r => r.LanguageCode).ToDictionary(g => g.Key, g => g.Select(x => x.Value).ToList());
        var byLanguage = rows.GroupBy(r => r.LanguageCode).OrderBy(g => g.Key).Select(g => new ApprovedColumnLanguageValuesResponse
        {
            LanguageCode = g.Key,
            Values = g.Select(x => x.Value).ToList()
        }).ToList();

        return new ApprovedColumnValuesByColumnResponse
        {
            ColumnSeq = columnSeq,
            ByLanguage = byLanguage
        };
    }
}