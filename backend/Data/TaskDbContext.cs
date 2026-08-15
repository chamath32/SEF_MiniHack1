using System;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Models;

namespace TaskTracker.Api.Data
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options)
        {
        }

        public DbSet<TaskItem> Tasks => Set<TaskItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Enum serialization to string in database
            modelBuilder.Entity<TaskItem>()
                .Property(t => t.Priority)
                .HasConversion<string>();

            modelBuilder.Entity<TaskItem>()
                .Property(t => t.Status)
                .HasConversion<string>();

            // Seed Data (at least 5 tasks)
            modelBuilder.Entity<TaskItem>().HasData(
                new TaskItem
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Title = "Set up Project Structure",
                    Assignee = "Alice",
                    Priority = TaskPriority.High,
                    Status = TaskItemStatus.Done,
                    DueDate = DateTime.SpecifyKind(DateTime.Parse("2026-08-14"), DateTimeKind.Utc),
                    CreatedAt = DateTime.SpecifyKind(DateTime.Parse("2026-08-13"), DateTimeKind.Utc)
                },
                new TaskItem
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Title = "Configure PostgreSQL Database",
                    Assignee = "Bob",
                    Priority = TaskPriority.High,
                    Status = TaskItemStatus.InProgress,
                    DueDate = DateTime.SpecifyKind(DateTime.Parse("2026-08-16"), DateTimeKind.Utc),
                    CreatedAt = DateTime.SpecifyKind(DateTime.Parse("2026-08-14"), DateTimeKind.Utc)
                },
                new TaskItem
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Title = "Implement REST API Endpoints",
                    Assignee = "Alice",
                    Priority = TaskPriority.Medium,
                    Status = TaskItemStatus.Todo,
                    DueDate = DateTime.SpecifyKind(DateTime.Parse("2026-08-18"), DateTimeKind.Utc),
                    CreatedAt = DateTime.SpecifyKind(DateTime.Parse("2026-08-15"), DateTimeKind.Utc)
                },
                new TaskItem
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Title = "Design Premium React Frontend",
                    Assignee = "Charlie",
                    Priority = TaskPriority.High,
                    Status = TaskItemStatus.Todo,
                    DueDate = DateTime.SpecifyKind(DateTime.Parse("2026-08-20"), DateTimeKind.Utc),
                    CreatedAt = DateTime.SpecifyKind(DateTime.Parse("2026-08-15"), DateTimeKind.Utc)
                },
                new TaskItem
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    Title = "Write Unit Tests and Verify",
                    Assignee = "Bob",
                    Priority = TaskPriority.Low,
                    Status = TaskItemStatus.Todo,
                    DueDate = DateTime.SpecifyKind(DateTime.Parse("2026-08-22"), DateTimeKind.Utc),
                    CreatedAt = DateTime.SpecifyKind(DateTime.Parse("2026-08-15"), DateTimeKind.Utc)
                }
            );
        }
    }
}
