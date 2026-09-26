using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovedColumnValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApprovedColumnValues",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    TranslationSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ColumnSeq = table.Column<int>(type: "int", nullable: false),
                    LanguageCode = table.Column<string>(type: "nvarchar(2)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApprovedColumnValues", x => x.TranslationSeq);
                    table.ForeignKey(
                        name: "FK_ApprovedColumnValues_Column_ColumnSeq",
                        column: x => x.ColumnSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Column",
                        principalColumn: "ColumnSeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApprovedColumnValues_ColumnSeq",
                schema: "turbo_barnacle",
                table: "ApprovedColumnValues",
                column: "ColumnSeq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApprovedColumnValues",
                schema: "turbo_barnacle");
        }
    }
}
