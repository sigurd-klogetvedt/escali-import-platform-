using WebAPI.DTOs.Responses;

namespace WebAPI.Services.Interfaces;

public interface ICurrencyService
{
    Task<List<CurrencyResponse>> GetCurrenciesAsync(CancellationToken cancellationToken = default);
}
