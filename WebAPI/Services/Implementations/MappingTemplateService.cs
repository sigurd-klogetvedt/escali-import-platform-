using Microsoft.EntityFrameworkCore;
using WebAPI.Data.DbContext;
using WebAPI.DTOs.Requests;
using WebAPI.DTOs.Responses;
using WebAPI.Models;
using WebAPI.Services.Interfaces;

namespace WebAPI.Services.Implementations;

public class MappingTemplateService : IMappingTemplateService
{
    private readonly ApplicationDbContext _dbContext;

    public MappingTemplateService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<MappingTemplateResponse> CreateAsync(CreateMappingTemplateRequest request, int companySeq, int createdByUserSeq, CancellationToken cancellationToken = default)
    {
        var interfaceExists = await _dbContext.Interfaces.AnyAsync(i => i.InterfaceSeq == request.InterfaceSeq, cancellationToken);
        if (!interfaceExists)
            throw new ArgumentException("Interface not found.", nameof(request.InterfaceSeq));

        var userBelongsToCompany = await _dbContext.Users.AnyAsync(u => u.UserSeq == createdByUserSeq && u.CompanySeq == companySeq, cancellationToken);
        if (!userBelongsToCompany)
            throw new UnauthorizedAccessException("User does not belong to the specific company.");

        var targetSeqs = request.ColumnMapping.Select(c => c.TargetColumnSeq).Distinct().ToList();

        var columnsForInterface = await _dbContext.Columns.Where(c => c.InterfaceSeq == request.InterfaceSeq && targetSeqs.Contains(c.ColumnSeq)).Select(c => c.ColumnSeq).ToListAsync(cancellationToken);
        if (columnsForInterface.Count != targetSeqs.Count)
        {
            var missing = targetSeqs.Except(columnsForInterface).ToList();
            throw new ArgumentException($"One or more target columns are missing or do not belong to interface {request.InterfaceSeq}: {string.Join(", ", missing)}.");
        }

        var now = DateTime.UtcNow;

        var entity = new MappingTemplate
        {
            TemplateName = request.TemplateName.Trim(),
            InterfaceSeq = request.InterfaceSeq,
            CompanySeq = companySeq,
            CreatedByUserSeq = createdByUserSeq,
            TemplateCreatedAt = now,
            ColumnMapping = request.ColumnMapping.Select(c => new MappingTemplateColumn
            {
                OriginalColumn = c.OriginalColumn.Trim(),
                TargetColumnSeq = c.TargetColumnSeq
            }).ToList()
        };

        _dbContext.MappingTemplates.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new MappingTemplateResponse
        {
            TemplateSeq = entity.TemplateSeq,
            TemplateName = entity.TemplateName,
            InterfaceSeq = entity.InterfaceSeq,
            CompanySeq = entity.CompanySeq,
            CreatedByUserSeq = entity.CreatedByUserSeq,
            TemplateCreatedAt = entity.TemplateCreatedAt,
            ColumnMapping = entity.ColumnMapping.Select(m => new MappingTemplateColumnResponse
            {
                TemplateColumnSeq = m.TemplateColumnSeq,
                OriginalColumn = m.OriginalColumn,
                TargetColumnSeq = m.TargetColumnSeq
            }).ToList()
        };
    }

    public async Task<MappingTemplateResponse?> GetByIdAsync(int templateSeq, int companySeq, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MappingTemplates.AsNoTracking().Where(t => t.TemplateSeq == templateSeq && t.CompanySeq == companySeq).Select(t => new MappingTemplateResponse
        {
            TemplateSeq = t.TemplateSeq,
            TemplateName = t.TemplateName,
            InterfaceSeq = t.InterfaceSeq,
            CompanySeq = t.CompanySeq,
            CreatedByUserSeq = t.CreatedByUserSeq,
            TemplateCreatedAt = t.TemplateCreatedAt,
            ColumnMapping = t.ColumnMapping
                .OrderBy(m => m.TemplateColumnSeq)
                .Select(m => new MappingTemplateColumnResponse
                {
                    TemplateColumnSeq = m.TemplateColumnSeq,
                    OriginalColumn = m.OriginalColumn,
                    TargetColumnSeq = m.TargetColumnSeq
                }).ToList()
        }).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<MappingTemplateListItemResponse>> ListByInterfaceAsync(int interfaceSeq, int companySeq, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MappingTemplates.AsNoTracking().Where(t => t.CompanySeq == companySeq && t.InterfaceSeq == interfaceSeq).OrderBy(t => t.TemplateName).Select(t => new MappingTemplateListItemResponse
        {
            TemplateSeq = t.TemplateSeq,
            TemplateName = t.TemplateName,
            InterfaceSeq = t.InterfaceSeq,
            TemplateCreatedAt = t.TemplateCreatedAt,
        }).ToListAsync(cancellationToken);
    }
}