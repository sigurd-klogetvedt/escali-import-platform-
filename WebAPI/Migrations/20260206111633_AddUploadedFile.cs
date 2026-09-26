using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUploadedFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UploadedFile",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    FileSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OriginalFileName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    FileStorageHash = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    FileSize = table.Column<float>(type: "real", nullable: false),
                    UploadedByUserSeq = table.Column<int>(type: "int", nullable: false),
                    CompanySeq = table.Column<int>(type: "int", nullable: false),
                    FileUploadedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UploadedFile", x => x.FileSeq);
                    table.ForeignKey(
                        name: "FK_UploadedFile_Company_CompanySeq",
                        column: x => x.CompanySeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Company",
                        principalColumn: "CompanySeq",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UploadedFile_User_UploadedByUserSeq",
                        column: x => x.UploadedByUserSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "User",
                        principalColumn: "UserSeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UploadedFile_CompanySeq",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                column: "CompanySeq");

            migrationBuilder.CreateIndex(
                name: "IX_UploadedFile_UploadedByUserSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                column: "UploadedByUserSeq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UploadedFile",
                schema: "turbo_barnacle");
        }
    }
}
