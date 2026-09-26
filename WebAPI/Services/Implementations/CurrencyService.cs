using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.DTOs.Responses;
using WebAPI.Services.Interfaces;

namespace WebAPI.Services.Implementations;

public class CurrencyService : ICurrencyService
{
    private readonly ApplicationDbContext _dbContext;

    public CurrencyService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<CurrencyResponse>> GetCurrenciesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Currencies.OrderBy(c => c.CurrencySeq).Select(c => new CurrencyResponse
        {
            CurrencySeq = c.CurrencySeq,
            CurrencyName = c.CurrencyName,
            CurrencyCode = c.CurrencyCode
        }).ToListAsync(cancellationToken);
    }
}
