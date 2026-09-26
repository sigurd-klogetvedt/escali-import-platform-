using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMappingTemplateAndMappingTemplateColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MappingTemplate",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    TemplateSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TemplateName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    InterfaceSeq = table.Column<int>(type: "int", nullable: false),
                    CompanySeq = table.Column<int>(type: "int", nullable: false),
                    CreatedByUserSeq = table.Column<int>(type: "int", nullable: false),
                    TemplateCreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MappingTemplate", x => x.TemplateSeq);
                    table.ForeignKey(
                        name: "FK_MappingTemplate_Company_CompanySeq",
                        column: x => x.CompanySeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Company",
                        principalColumn: "CompanySeq",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MappingTemplate_Interface_InterfaceSeq",
                        column: x => x.InterfaceSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Interface",
                        principalColumn: "InterfaceSeq",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MappingTemplate_User_CreatedByUserSeq",
                        column: x => x.CreatedByUserSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "User",
                        principalColumn: "UserSeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MappingTemplateColumn",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    TemplateColumnSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OriginalColumn = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    TargetColumnSeq = table.Column<int>(type: "int", nullable: false),
                    TemplateSeq = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MappingTemplateColumn", x => x.TemplateColumnSeq);
                    table.ForeignKey(
                        name: "FK_MappingTemplateColumn_Column_TargetColumnSeq",
                        column: x => x.TargetColumnSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Column",
                        principalColumn: "ColumnSeq",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MappingTemplateColumn_MappingTemplate_TemplateSeq",
                        column: x => x.TemplateSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "MappingTemplate",
                        principalColumn: "TemplateSeq",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MappingTemplate_CompanySeq",
                schema: "turbo_barnacle",
                table: "MappingTemplate",
                column: "CompanySeq");

            migrationBuilder.CreateIndex(
                name: "IX_MappingTemplate_CreatedByUserSeq",
                schema: "turbo_barnacle",
                table: "MappingTemplate",
                column: "CreatedByUserSeq");

            migrationBuilder.CreateIndex(
                name: "IX_MappingTemplate_InterfaceSeq",
                schema: "turbo_barnacle",
                table: "MappingTemplate",
                column: "InterfaceSeq");

            migrationBuilder.CreateIndex(
                name: "IX_MappingTemplateColumn_TargetColumnSeq",
                schema: "turbo_barnacle",
                table: "MappingTemplateColumn",
                column: "TargetColumnSeq");

            migrationBuilder.CreateIndex(
                name: "IX_MappingTemplateColumn_TemplateSeq",
                schema: "turbo_barnacle",
                table: "MappingTemplateColumn",
                column: "TemplateSeq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MappingTemplateColumn",
                schema: "turbo_barnacle");

            migrationBuilder.DropTable(
                name: "MappingTemplate",
                schema: "turbo_barnacle");
        }
    }
}
