using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class RuleCombinationConfiguration : IEntityTypeConfiguration<RuleCombination>
{
    public void Configure(EntityTypeBuilder<RuleCombination> builder)
    {
        builder.ToTable("RuleCombination");

        builder.HasKey(e => e.CombinationSeq);
        builder.Property(e => e.CombinationSeq).UseIdentityColumn();

        builder.HasIndex(e => e.RuleSeq);

        builder.HasOne(e => e.InterfaceRule).WithMany(r => r.RuleCombinations).HasForeignKey(e => e.RuleSeq).OnDelete(DeleteBehavior.Restrict);
    }
}