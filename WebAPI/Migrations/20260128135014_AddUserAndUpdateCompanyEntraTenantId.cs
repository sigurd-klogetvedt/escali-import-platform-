using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAndUpdateCompanyEntraTenantId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "EntraTenantId",
                schema: "turbo_barnacle",
                table: "Company",
                type: "nvarchar(36)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(36)");

            migrationBuilder.CreateTable(
                name: "User",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    UserSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EntraIdObjectId = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    UserEmail = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CompanySeq = table.Column<int>(type: "int", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    UserCreated = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UserUpdated = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserSeq);
                    table.ForeignKey(
                        name: "FK_User_Company_CompanySeq",
                        column: x => x.CompanySeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Company",
                        principalColumn: "CompanySeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Company_EntraTenantId",
                schema: "turbo_barnacle",
                table: "Company",
                column: "EntraTenantId",
                unique: true,
                filter: "[EntraTenantId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_User_CompanySeq",
                schema: "turbo_barnacle",
                table: "User",
                column: "CompanySeq");

            migrationBuilder.CreateIndex(
                name: "IX_User_UserEmail",
                schema: "turbo_barnacle",
                table: "User",
                column: "UserEmail",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "User",
                schema: "turbo_barnacle");

            migrationBuilder.DropIndex(
                name: "IX_Company_EntraTenantId",
                schema: "turbo_barnacle",
                table: "Company");

            migrationBuilder.AlterColumn<string>(
                name: "EntraTenantId",
                schema: "turbo_barnacle",
                table: "Company",
                type: "nvarchar(36)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(36)",
                oldNullable: true);
        }
    }
}
