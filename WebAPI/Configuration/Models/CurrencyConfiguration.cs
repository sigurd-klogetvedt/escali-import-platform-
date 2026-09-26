using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebAPI.Models;

namespace WebAPI.Configuration.Models;

public class CurrencyConfiguration : IEntityTypeConfiguration<Currency>
{
    public void Configure(EntityTypeBuilder<Currency> builder)
    {
        builder.ToTable("Currency");

        builder.HasKey(e => e.CurrencySeq);
        builder.Property(e => e.CurrencySeq).UseIdentityColumn();

        builder.Property(e => e.CurrencyName).HasColumnType("nvarchar(50)").IsRequired();
        builder.Property(e => e.CurrencyCode).HasColumnType("nvarchar(3)").IsRequired();

        builder.HasIndex(e => e.CurrencyCode).IsUnique();

        builder.HasData(
            new Currency { CurrencySeq = 1, CurrencyName = "Norsk krone",  CurrencyCode = "NOK" },
            new Currency { CurrencySeq = 2, CurrencyName = "Svensk krona", CurrencyCode = "SEK" },
            new Currency { CurrencySeq = 3, CurrencyName = "US dollar",    CurrencyCode = "USD" },
            new Currency { CurrencySeq = 4, CurrencyName = "Euro",         CurrencyCode = "EUR" }
        );
    }
}
