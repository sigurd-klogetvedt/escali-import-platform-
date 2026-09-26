using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class DataTypeConfiguration : IEntityTypeConfiguration<DataType>
{
    public void Configure(EntityTypeBuilder<DataType> builder)
    {
        builder.ToTable("DataTypes");

        builder.HasKey(e => e.DataTypeSeq);
        builder.Property(e => e.DataTypeSeq).UseIdentityColumn();

        builder.Property(e => e.Type).HasColumnType("nvarchar(50)");
        builder.HasIndex(e => e.Type).IsUnique();
    }
}