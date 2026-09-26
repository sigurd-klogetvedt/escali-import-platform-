using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateCurrencyModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Currency",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    CurrencySeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CurrencyName = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    CurrencyCode = table.Column<string>(type: "nvarchar(3)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currency", x => x.CurrencySeq);
                });

            migrationBuilder.InsertData(
                schema: "turbo_barnacle",
                table: "Currency",
                columns: new[] { "CurrencySeq", "CurrencyCode", "CurrencyName" },
                values: new object[,]
                {
                    { 1, "NOK", "Norsk krone" },
                    { 2, "SEK", "Svensk krona" },
                    { 3, "USD", "US dollar" },
                    { 4, "EUR", "Euro" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Currency_CurrencyCode",
                schema: "turbo_barnacle",
                table: "Currency",
                column: "CurrencyCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Currency",
                schema: "turbo_barnacle");
        }
    }
}
