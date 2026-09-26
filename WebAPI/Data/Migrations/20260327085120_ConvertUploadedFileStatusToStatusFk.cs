using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ConvertUploadedFileStatusToStatusFk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                schema: "turbo_barnacle",
                table: "UploadedFile");

            migrationBuilder.AddColumn<int>(
                name: "StatusSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Status",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    StatusSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Status", x => x.StatusSeq);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UploadedFile_StatusSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                column: "StatusSeq");

            migrationBuilder.CreateIndex(
                name: "IX_Status_StatusName",
                schema: "turbo_barnacle",
                table: "Status",
                column: "StatusName",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UploadedFile_Status_StatusSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                column: "StatusSeq",
                principalSchema: "turbo_barnacle",
                principalTable: "Status",
                principalColumn: "StatusSeq",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UploadedFile_Status_StatusSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile");

            migrationBuilder.DropTable(
                name: "Status",
                schema: "turbo_barnacle");

            migrationBuilder.DropIndex(
                name: "IX_UploadedFile_StatusSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile");

            migrationBuilder.DropColumn(
                name: "StatusSeq",
                schema: "turbo_barnacle",
                table: "UploadedFile");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                schema: "turbo_barnacle",
                table: "UploadedFile",
                type: "nvarchar(50)",
                nullable: true);
        }
    }
}
