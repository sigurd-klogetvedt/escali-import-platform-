using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("User");

        builder.HasKey(e => e.UserSeq);
        builder.Property(e => e.UserSeq).UseIdentityColumn();

        builder.Property(e => e.EntraIdObjectId).HasColumnType("nvarchar(36)").IsRequired(false);
        builder.Property(e => e.UserEmail).HasColumnType("nvarchar(255)");
        builder.Property(e => e.UserName).HasColumnType("nvarchar(255)");
        builder.Property(e => e.IsAdmin).HasDefaultValue(false);
        builder.Property(e => e.IsActive).HasDefaultValue(true);
        builder.Property(e => e.LastLoginAt).HasColumnType("datetime").IsRequired(false);
        builder.Property(e => e.UserCreated).HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");
        builder.Property(e => e.UserUpdated).HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");

        builder.HasIndex(e => e.UserEmail).IsUnique();
        builder.HasIndex(e => e.EntraIdObjectId).IsUnique().HasFilter("[EntraIdObjectId] IS NOT NULL");
        builder.HasIndex(e => e.CompanySeq);
    }
}
