using WebAPI.DTOs.Responses;

namespace WebAPI.Services.Interfaces;

public interface IApprovedColumnValuesService
{
    Task<ApprovedColumnValuesByColumnResponse?> GetByColumnSeqAsync(int columnSeq, CancellationToken cancellationToken = default);
}