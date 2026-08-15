using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Data;
using TaskTracker.Api.Models;

namespace TaskTracker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskDbContext _context;

        public TasksController(TaskDbContext context)
        {
            _context = context;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks(
            [FromQuery] TaskItemStatus? status,
            [FromQuery] string? assignee,
            [FromQuery] string? search)
        {
            var query = _context.Tasks.AsQueryable();

            // Filter by status
            if (status.HasValue)
            {
                query = query.Where(t => t.Status == status.Value);
            }

            // Filter by assignee (exact match, case-insensitive)
            if (!string.IsNullOrWhiteSpace(assignee))
            {
                query = query.Where(t => t.Assignee.ToLower() == assignee.Trim().ToLower());
            }

            // Search by title (contains, case-insensitive)
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(t => t.Title.ToLower().Contains(search.Trim().ToLower()));
            }

            // Sorted by due date (ascending)
            var tasks = await query.OrderBy(t => t.DueDate).ToListAsync();

            return Ok(tasks);
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(Guid id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            // Title validation (also handled by [Required] attribute in model)
            if (string.IsNullOrWhiteSpace(task.Title))
            {
                ModelState.AddModelError("Title", "Task title is required.");
            }

            // DueDate validation: cannot be in the past (using Date check to allow tasks due today)
            if (task.DueDate.Date < DateTime.UtcNow.Date)
            {
                ModelState.AddModelError("DueDate", "Due date cannot be in the past.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Force new GUID and CreatedAt
            task.Id = Guid.NewGuid();
            task.CreatedAt = DateTime.UtcNow;
            
            // Ensure DueDate is treated as UTC in PostgreSQL
            task.DueDate = DateTime.SpecifyKind(task.DueDate, DateTimeKind.Utc);

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // PUT: api/tasks/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] TaskItemStatusUpdateDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            task.Status = dto.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class TaskItemStatusUpdateDto
    {
        public TaskItemStatus Status { get; set; }
    }
}
