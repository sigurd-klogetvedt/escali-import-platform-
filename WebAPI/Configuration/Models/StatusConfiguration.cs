using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class StatusConfiguration : IEntityTypeConfiguration<Status>
{
    public void Configure(EntityTypeBuilder<Status> builder)
    {
        builder.ToTable("Status");

        builder.HasKey(e => e.StatusSeq);
        builder.Property(e => e.StatusSeq).UseIdentityColumn();

        builder.Property(e => e.StatusName).HasColumnType("nvarchar(50)").IsRequired();

        builder.HasIndex(e => e.StatusName).IsUnique();
    }
}