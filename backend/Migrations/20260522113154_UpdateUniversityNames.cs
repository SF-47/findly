using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUniversityNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Universities",
                newName: "ShortName");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Universities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Universities_ShortName_FullName_Branch",
                table: "Universities",
                columns: new[] { "ShortName", "FullName", "Branch" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Universities_ShortName_FullName_Branch",
                table: "Universities");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Universities");

            migrationBuilder.RenameColumn(
                name: "ShortName",
                table: "Universities",
                newName: "Name");
        }
    }
}
