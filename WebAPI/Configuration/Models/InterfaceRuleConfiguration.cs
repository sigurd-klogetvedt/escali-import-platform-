using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class InterfaceRuleConfiguration : IEntityTypeConfiguration<InterfaceRule>
{
    public void Configure(EntityTypeBuilder<InterfaceRule> builder)
    {
        builder.ToTable("InterfaceRule");

        builder.HasKey(e => e.RuleSeq);
        builder.Property(e => e.RuleSeq).UseIdentityColumn();

        builder.Property(e => e.RuleTypeCode).HasConversion<string>().HasColumnType("nvarchar(50)");
        builder.Property(e => e.RuleName).HasColumnType("nvarchar(255)");

        builder.HasIndex(e => e.InterfaceSeq);

        builder.HasOne(e => e.Interface).WithMany().HasForeignKey(e => e.InterfaceSeq).OnDelete(DeleteBehavior.Restrict);
    }
}