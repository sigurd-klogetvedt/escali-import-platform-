using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.ToTable("Company");

        builder.HasKey(e => e.CompanySeq);
        builder.Property(e => e.CompanySeq).UseIdentityColumn();

        builder.Property(e => e.CompanyName).HasColumnType("nvarchar(50)");
        builder.Property(e => e.EntraTenantId).HasColumnType("nvarchar(36)").IsRequired(false);
        builder.Property(e => e.IsActive).HasDefaultValue(true);
        builder.Property(e => e.CompanyCreated).HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");
        builder.Property(e => e.CompanyUpdated).HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");

        builder.HasIndex(e => e.EntraTenantId).IsUnique();

        builder.HasMany(e => e.Users).WithOne(e => e.Company).HasForeignKey(e => e.CompanySeq).OnDelete(DeleteBehavior.Restrict);
    }
}
