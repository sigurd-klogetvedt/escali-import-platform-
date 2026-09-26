using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddInterfaceAndColumnTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InterfaceSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMapped",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Interface",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    InterfaceSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InterfaceType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    InterfaceCreatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    InterfaceUpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interface", x => x.InterfaceSeq);
                });

            migrationBuilder.CreateTable(
                name: "Column",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    ColumnSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InterfaceSeq = table.Column<int>(type: "int", nullable: false),
                    ColumnFieldName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    ColumnType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    ColumnRequired = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ColumnRemarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ColumnCreatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ColumnUpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Column", x => x.ColumnSeq);
                    table.ForeignKey(
                        name: "FK_Column_Interface_InterfaceSeq",
                        column: x => x.InterfaceSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Interface",
                        principalColumn: "InterfaceSeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UploadedFile_InterfaceSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                column: "InterfaceSeq");

            migrationBuilder.CreateIndex(
                name: "IX_Column_InterfaceSeq",
                schema: "turbo_barnacle",
                table: "Column",
                column: "InterfaceSeq");

            migrationBuilder.AddForeignKey(
                name: "FK_UploadedFile_Interface_InterfaceSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                column: "InterfaceSeq",
                principalSchema: "turbo_barnacle",
                principalTable: "Interface",
                principalColumn: "InterfaceSeq",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UploadedFile_Interface_InterfaceSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile");

            migrationBuilder.DropTable(
                name: "Column",
                schema: "turbo_barnacle");

            migrationBuilder.DropTable(
                name: "Interface",
                schema: "turbo_barnacle");

            migrationBuilder.DropIndex(
                name: "IX_UploadedFile_InterfaceSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile");

            migrationBuilder.DropColumn(
                name: "InterfaceSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile");

            migrationBuilder.DropColumn(
                name: "IsMapped",
                schema: "turbo_barnacle",
                table: "UploadedFile");
        }
    }
}
