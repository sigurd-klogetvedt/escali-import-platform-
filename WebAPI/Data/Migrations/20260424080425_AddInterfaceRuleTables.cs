using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddInterfaceRuleTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InterfaceRule",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    RuleSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InterfaceSeq = table.Column<int>(type: "int", nullable: false),
                    RuleTypeCode = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    RuleName = table.Column<string>(type: "nvarchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InterfaceRule", x => x.RuleSeq);
                    table.ForeignKey(
                        name: "FK_InterfaceRule_Interface_InterfaceSeq",
                        column: x => x.InterfaceSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Interface",
                        principalColumn: "InterfaceSeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RuleCombination",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    CombinationSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RuleSeq = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RuleCombination", x => x.CombinationSeq);
                    table.ForeignKey(
                        name: "FK_RuleCombination_InterfaceRule_RuleSeq",
                        column: x => x.RuleSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "InterfaceRule",
                        principalColumn: "RuleSeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RuleCombinationMember",
                schema: "turbo_barnacle",
                columns: table => new
                {
                    MemberSeq = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CombinationSeq = table.Column<int>(type: "int", nullable: false),
                    ColumnSeq = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RuleCombinationMember", x => x.MemberSeq);
                    table.ForeignKey(
                        name: "FK_RuleCombinationMember_Column_ColumnSeq",
                        column: x => x.ColumnSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "Column",
                        principalColumn: "ColumnSeq",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RuleCombinationMember_RuleCombination_CombinationSeq",
                        column: x => x.CombinationSeq,
                        principalSchema: "turbo_barnacle",
                        principalTable: "RuleCombination",
                        principalColumn: "CombinationSeq",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InterfaceRule_InterfaceSeq",
                schema: "turbo_barnacle",
                table: "InterfaceRule",
                column: "InterfaceSeq");

            migrationBuilder.CreateIndex(
                name: "IX_RuleCombination_RuleSeq",
                schema: "turbo_barnacle",
                table: "RuleCombination",
                column: "RuleSeq");

            migrationBuilder.CreateIndex(
                name: "IX_RuleCombinationMember_ColumnSeq",
                schema: "turbo_barnacle",
                table: "RuleCombinationMember",
                column: "ColumnSeq");

            migrationBuilder.CreateIndex(
                name: "IX_RuleCombinationMember_CombinationSeq",
                schema: "turbo_barnacle",
                table: "RuleCombinationMember",
                column: "CombinationSeq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RuleCombinationMember",
                schema: "turbo_barnacle");

            migrationBuilder.DropTable(
                name: "RuleCombination",
                schema: "turbo_barnacle");

            migrationBuilder.DropTable(
                name: "InterfaceRule",
                schema: "turbo_barnacle");
        }
    }
}
