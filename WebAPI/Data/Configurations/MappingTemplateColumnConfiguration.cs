using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Data.Configurations;

public class MappingTemplateColumnConfiguration : IEntityTypeConfiguration<MappingTemplateColumn>
{
    public void Configure(EntityTypeBuilder<MappingTemplateColumn> builder)
    {
        builder.ToTable("MappingTemplateColumn");
        builder.HasKey(e => e.TemplateColumnSeq);

        builder.Property(e => e.OriginalColumn).HasColumnType("nvarchar(255)");

        builder.HasOne(e => e.TargetColumn).WithMany().HasForeignKey(e => e.TargetColumnSeq).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Template).WithMany(t => t.ColumnMapping).HasForeignKey(e => e.TemplateSeq).OnDelete(DeleteBehavior.Cascade);
    }
}