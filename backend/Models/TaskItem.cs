using System;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Api.Models
{
    public enum TaskPriority
    {
        Low,
        Medium,
        High
    }

    public enum TaskItemStatus
    {
        Todo,
        InProgress,
        Done
    }

    public class TaskItem
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Task title is required.")]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public required string Title { get; set; }

        public string Assignee { get; set; } = string.Empty;

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;

        public DateTime DueDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
