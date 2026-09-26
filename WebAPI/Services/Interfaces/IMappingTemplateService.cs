using WebAPI.DTOs.Requests;
using WebAPI.DTOs.Responses;

namespace WebAPI.Services.Interfaces;

public interface IMappingTemplateService
{
    Task<MappingTemplateResponse> CreateAsync(CreateMappingTemplateRequest request, int companySeq, int createdByUserSeq, CancellationToken cancellationToken = default);
    Task<MappingTemplateResponse?> GetByIdAsync(int templateSeq, int companySeq, CancellationToken cancellationToken = default);
    Task<List<MappingTemplateListItemResponse>> ListByInterfaceAsync(int interfaceSeq, int companySeq, CancellationToken cancellationToken = default);
}