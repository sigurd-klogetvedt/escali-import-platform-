using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class ColumnFieldDescriptionConfiguration : IEntityTypeConfiguration<ColumnFieldDescription>
{
    public void Configure(EntityTypeBuilder<ColumnFieldDescription> builder)
    {
        builder.ToTable("ColumnFieldDescription");

        builder.HasKey(e => e.FieldDescriptionSeq);
        builder.Property(e => e.FieldDescriptionSeq).UseIdentityColumn();

        builder.Property(e => e.ColumnSeq);

        builder.Property(e => e.LanguageCode).HasColumnType("nvarchar(2)").IsRequired();

        builder.Property(e => e.Value).HasColumnType("nvarchar(max)").IsRequired();

        builder.HasIndex(e => e.ColumnSeq);

        builder.HasOne(e => e.Column).WithMany(c => c.ColumnFieldDescriptions).HasForeignKey(e => e.ColumnSeq).OnDelete(DeleteBehavior.Restrict);
    }
}