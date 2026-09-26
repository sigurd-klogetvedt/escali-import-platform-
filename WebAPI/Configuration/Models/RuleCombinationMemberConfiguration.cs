using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class RuleCombinationMemberConfiguration : IEntityTypeConfiguration<RuleCombinationMember>
{
    public void Configure(EntityTypeBuilder<RuleCombinationMember> builder)
    {
        builder.ToTable("RuleCombinationMember");

        builder.HasKey(e => e.MemberSeq);
        builder.Property(e => e.MemberSeq).UseIdentityColumn();

        builder.HasIndex(e => e.CombinationSeq);
        builder.HasIndex(e => e.ColumnSeq);

        builder.HasOne(e => e.RuleCombination).WithMany(c => c.RuleCombinationMembers).HasForeignKey(e => e.CombinationSeq).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Column).WithMany().HasForeignKey(e => e.ColumnSeq).OnDelete(DeleteBehavior.Restrict);
    }
}