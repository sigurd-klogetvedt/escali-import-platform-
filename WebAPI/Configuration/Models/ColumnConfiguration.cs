using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class ColumnConfiguration : IEntityTypeConfiguration<Column>
{
    public void Configure(EntityTypeBuilder<Column> builder)
    {
        builder.ToTable("Column");

        builder.HasKey(e => e.ColumnSeq);
        builder.Property(e => e.ColumnSeq).UseIdentityColumn();

        builder.Property(e => e.InterfaceSeq);

        builder.Property(e => e.ColumnFieldName).HasColumnType("nvarchar(255)");

        builder.Property(e => e.DataTypeSeq);

        builder.Property(e => e.ColumnRequired).HasDefaultValue(false);

        builder.Property(e => e.ColumnNeedsApprovedValues).HasDefaultValue(false);

        builder.Property(e => e.ColumnCreatedAt).HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");

        builder.Property(e => e.ColumnUpdatedAt).HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");

        builder.HasIndex(e => e.InterfaceSeq);
        builder.HasIndex(e => e.DataTypeSeq);

        builder.HasOne(e => e.DataType).WithMany(d => d.Columns).HasForeignKey(e => e.DataTypeSeq).OnDelete(DeleteBehavior.Restrict);
        //builder.HasOne(e => e.DataType).WithMany(dt => dt.Columns).HasForeignKey(e => e.DataTypeSeq).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.Interface).WithMany(i => i.Columns).HasForeignKey(e => e.InterfaceSeq).OnDelete(DeleteBehavior.Restrict);
    }
}