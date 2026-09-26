using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCompanyDomainAndAddIsAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyDomain",
                schema: "turbo_barnacle");

            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                schema: "turbo_barnacle",
                table: "User",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_User_EntraIdObjectId",
                schema: "turbo_barnacle",
                table: "User",
                column: "EntraIdObjectId",
                unique: true,
                filter: "[EntraIdObjectId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_User_EntraIdObjectId",
                schema: "turbo_barnacle",
                table: "User");

            migrationBuilder.DropColumn(
                name: "IsAdmin",
                schema: "turbo_barnacle",
                table: "User");

            migrationBuilder.CreateTable(
                name: "CompanyDomain",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    DomainSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanySeq = table.Column<int>(type: "int", nullable: false),
                    DomainCreated = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    DomainUpdated = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    EmailDomain = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyDomain", x => x.DomainSeq);
                    table.ForeignKey(
                        name: "FK_CompanyDomain_Company_CompanySeq",
                        column: x => x.CompanySeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Company",
                        principalColumn: "CompanySeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDomain_CompanySeq",
                schema: "turbo_barnacle",
                table: "CompanyDomain",
                column: "CompanySeq");
        }
    }
}
