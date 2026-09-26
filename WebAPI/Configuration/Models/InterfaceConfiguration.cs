using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class InterfaceConfiguration : IEntityTypeConfiguration<Interface>
{
    public void Configure(EntityTypeBuilder<Interface> builder)
    {
        builder.ToTable("Interface");

        builder.HasKey(e => e.InterfaceSeq);
        builder.Property(e => e.InterfaceSeq).UseIdentityColumn();

        builder.Property(e => e.InterfaceName).HasConversion<string>().HasColumnType("nvarchar(50)");
        builder.HasMany(e => e.Columns).WithOne(c => c.Interface).HasForeignKey(c => c.InterfaceSeq).OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.InterfaceCreatedAt).HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");
        builder.Property(e => e.InterfaceUpdatedAt).HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");
    }
}
