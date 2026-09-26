using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateColumnRemoveRemarksAddNeedsApprovedValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColumnRemarks",
                schema: "turbo_barnacle",
                table: "Column");

            migrationBuilder.AddColumn<bool>(
                name: "ColumnNeedsApprovedValues",
                schema: "turbo_barnacle",
                table: "Column",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColumnNeedsApprovedValues",
                schema: "turbo_barnacle",
                table: "Column");

            migrationBuilder.AddColumn<string>(
                name: "ColumnRemarks",
                schema: "turbo_barnacle",
                table: "Column",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
