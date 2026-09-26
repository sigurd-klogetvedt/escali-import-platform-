using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class UploadedFileConfiguration : IEntityTypeConfiguration<UploadedFile>
{
    public void Configure(EntityTypeBuilder<UploadedFile> builder)
    {
        builder.ToTable("UploadedFile");

        builder.HasKey(e => e.FileSeq);
        builder.Property(e => e.FileSeq).UseIdentityColumn();

        builder.Property(e => e.OriginalFileName).HasColumnType("nvarchar(255)");
        builder.Property(e => e.FileStorageHash).HasColumnType("nvarchar(255)");
        builder.Property(e => e.FileType).HasConversion<string>().HasColumnType("nvarchar(50)");
        builder.Property(e => e.FileSize).HasColumnType("real");
        builder.Property(e => e.FileUploadedAt).HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");

        builder.Property(e => e.IsMapped).HasDefaultValue(false);
        builder.Property(e => e.InterfaceSeq);

        builder.Property(e => e.StatusSeq).IsRequired(false);

        builder.Property(e => e.LocalStorage).HasDefaultValue(false);

        builder.HasIndex(e => e.CompanySeq);
        builder.HasIndex(e => e.UploadedByUserSeq);
        builder.HasIndex(e => e.InterfaceSeq);
        builder.HasIndex(e => e.StatusSeq);

        builder.HasOne(e => e.UploadedByUser).WithMany().HasForeignKey(e => e.UploadedByUserSeq).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Company).WithMany().HasForeignKey(e => e.CompanySeq).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Interface).WithMany().HasForeignKey(e => e.InterfaceSeq).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Status).WithMany().HasForeignKey(e => e.StatusSeq).OnDelete(DeleteBehavior.Restrict);
    }
}
