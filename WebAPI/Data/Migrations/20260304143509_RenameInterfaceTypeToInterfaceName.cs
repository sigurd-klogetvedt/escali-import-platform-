using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameInterfaceTypeToInterfaceName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InterfaceType",
                schema: "turbo_barnacle",
                table: "Interface",
                newName: "InterfaceName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InterfaceName",
                schema: "turbo_barnacle",
                table: "Interface",
                newName: "InterfaceType");
        }
    }
}
