using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyAndCompanyDomain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "turbo_barnacle");

            migrationBuilder.CreateTable(
                name: "Company",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    CompanySeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyName = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    EntraTenantId = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CompanyCreated = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    CompanyUpdated = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.CompanySeq);
                });

            migrationBuilder.CreateTable(
                name: "CompanyDomain",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    DomainSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanySeq = table.Column<int>(type: "int", nullable: false),
                    EmailDomain = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DomainCreated = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    DomainUpdated = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()")
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyDomain",
                schema: "turbo_barnacle");

            migrationBuilder.DropTable(
                name: "Company",
                schema: "turbo_barnacle");
        }
    }
}
