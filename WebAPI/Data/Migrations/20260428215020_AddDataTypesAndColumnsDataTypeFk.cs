using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDataTypesAndColumnsDataTypeFk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColumnType",
                schema: "turbo_barnacle",
                table: "Column");

            migrationBuilder.AddColumn<int>(
                name: "DataTypeSeq",
                schema: "turbo_barnacle",
                table: "Column",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DataTypes",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    DataTypeSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataTypes", x => x.DataTypeSeq);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Column_DataTypeSeq",
                schema: "turbo_barnacle",
                table: "Column",
                column: "DataTypeSeq");

            migrationBuilder.CreateIndex(
                name: "IX_DataTypes_Type",
                schema: "turbo_barnacle",
                table: "DataTypes",
                column: "Type",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Column_DataTypes_DataTypeSeq",
                schema: "turbo_barnacle",
                table: "Column",
                column: "DataTypeSeq",
                principalSchema: "turbo_barnacle",
                principalTable: "DataTypes",
                principalColumn: "DataTypeSeq",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Column_DataTypes_DataTypeSeq",
                schema: "turbo_barnacle",
                table: "Column");

            migrationBuilder.DropTable(
                name: "DataTypes",
                schema: "turbo_barnacle");

            migrationBuilder.DropIndex(
                name: "IX_Column_DataTypeSeq",
                schema: "turbo_barnacle",
                table: "Column");

            migrationBuilder.DropColumn(
                name: "DataTypeSeq",
                schema: "turbo_barnacle",
                table: "Column");

            migrationBuilder.AddColumn<string>(
                name: "ColumnType",
                schema: "turbo_barnacle",
                table: "Column",
                type: "nvarchar(50)",
                nullable: false,
                defaultValue: "");
        }
    }
}
