using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnFieldDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ColumnFieldDescription",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    FieldDescriptionSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ColumnSeq = table.Column<int>(type: "int", nullable: false),
                    LanguageCode = table.Column<string>(type: "nvarchar(2)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColumnFieldDescription", x => x.FieldDescriptionSeq);
                    table.ForeignKey(
                        name: "FK_ColumnFieldDescription_Column_ColumnSeq",
                        column: x => x.ColumnSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Column",
                        principalColumn: "ColumnSeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ColumnFieldDescription_ColumnSeq",
                schema: "turbo_barnacle",
                table: "ColumnFieldDescription",
                column: "ColumnSeq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ColumnFieldDescription",
                schema: "turbo_barnacle");
        }
    }
}
