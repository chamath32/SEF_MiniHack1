using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Assignee = table.Column<string>(type: "text", nullable: false),
                    Priority = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Tasks",
                columns: new[] { "Id", "Assignee", "CreatedAt", "DueDate", "Priority", "Status", "Title" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Alice", new DateTime(2026, 8, 13, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 14, 0, 0, 0, 0, DateTimeKind.Utc), "High", "Done", "Set up Project Structure" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Bob", new DateTime(2026, 8, 14, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 16, 0, 0, 0, 0, DateTimeKind.Utc), "High", "InProgress", "Configure PostgreSQL Database" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Alice", new DateTime(2026, 8, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 18, 0, 0, 0, 0, DateTimeKind.Utc), "Medium", "Todo", "Implement REST API Endpoints" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Charlie", new DateTime(2026, 8, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 20, 0, 0, 0, 0, DateTimeKind.Utc), "High", "Todo", "Design Premium React Frontend" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "Bob", new DateTime(2026, 8, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 22, 0, 0, 0, 0, DateTimeKind.Utc), "Low", "Todo", "Write Unit Tests and Verify" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tasks");
        }
    }
}
