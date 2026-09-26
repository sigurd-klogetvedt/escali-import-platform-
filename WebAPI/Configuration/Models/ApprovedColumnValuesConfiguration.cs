using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class ApprovedColumnValuesConfiguration : IEntityTypeConfiguration<ApprovedColumnValues>
{
    public void Configure(EntityTypeBuilder<ApprovedColumnValues> builder)
    {
        builder.ToTable("ApprovedColumnValues");

        builder.HasKey(e => e.TranslationSeq);
        builder.Property(e => e.TranslationSeq).UseIdentityColumn();

        builder.Property(e => e.ColumnSeq);

        builder.Property(e => e.LanguageCode).HasColumnType("nvharcar(2)").IsRequired();

        builder.Property(e => e.Value).HasColumnType("nvarchar(max)").IsRequired();

        builder.HasIndex(e => e.ColumnSeq);

        builder.HasOne(e => e.Column).WithMany().HasForeignKey(e => e.ColumnSeq).OnDelete(DeleteBehavior.Restrict);
    }
}