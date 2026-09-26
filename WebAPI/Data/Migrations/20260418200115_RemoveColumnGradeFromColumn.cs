using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveColumnGradeFromColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColumnGrade",
                schema: "turbo_barnacle",
                table: "Column");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColumnGrade",
                schema: "turbo_barnacle",
                table: "Column",
                type: "nvarchar(50)",
                nullable: false,
                defaultValue: "NULL");
        }
    }
}
