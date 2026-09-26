using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Data.Configurations;

public class MappingTemplateConfiguration : IEntityTypeConfiguration<MappingTemplate>
{
    public void Configure(EntityTypeBuilder<MappingTemplate> builder)
    {
        builder.ToTable("MappingTemplate");
        builder.HasKey(e => e.TemplateSeq);

        builder.Property(e => e.TemplateName).HasColumnType("nvarchar(255)");

        builder.HasOne(e => e.Interface).WithMany().HasForeignKey(e => e.InterfaceSeq).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Company).WithMany().HasForeignKey(e => e.CompanySeq).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.CreatedByUser).WithMany().HasForeignKey(e => e.CreatedByUserSeq).OnDelete(DeleteBehavior.Restrict);
    }
}