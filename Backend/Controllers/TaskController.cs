using Microsoft.AspNetCore.Mvc;
using smart_task_manager.Models;
using smart_task_manager.Services;
using smart_task_manager.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using smart_task_manager.Data;
using Microsoft.EntityFrameworkCore;

namespace smart_task_manager.Controllers
{
    [ApiController] // tells ASP.NET this is an API controller
    [Route("api/tasks")] //  sets base URL to api/tasks
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;

        public TaskController(ITaskService taskService, UserManager<User> userManager, AppDbContext context)
        {
            _context = context;
            _taskService = taskService;
            _userManager = userManager;
        }
        //Get : get all tasks
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var result = await _taskService.GetAll();
            return Ok(result);

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTasksById(int id)
        {
            var task = await _taskService.GetTaskById(id);
            if (task == null) return NotFound();
            return Ok(task);
        }


        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;



            var task = new TaskItem
            {
                Title = dto.Title,
                DueDate = dto.DueDate,
                ProjectName = dto.ProjectName,
                Description = dto.Description,
                Status = dto.Status
            };

            var newTask = await _taskService.CreateTask(task, userId);
            return Ok(newTask);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var result = await _taskService.DeleteTask(id);
            if (result)
            {
                // Return 200 OK with success message
                return Ok($"Task with ID {id} was deleted successfully.");
            }
            else
            {
                // Return 400 Bad Request if something went wrong
                return BadRequest($"Failed to delete task with ID {id}.");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem task)
        {
            var existing = await _taskService.GetTaskById(id);
            if (existing == null)
                return NotFound($"Task with ID {id} not found.");

            var result = await _taskService.UpdateTask(task, id);

            if (result)
                return Ok($"Task with ID {id} was updated successfully.");
            else
                return BadRequest($"Failed to update task with ID {id}.");
        }

        [HttpGet("summary")]
        public async Task<ActionResult<TaskSummaryDto>> GetSummary()
        {
            var total = await _context.Tasks.CountAsync();
            var completed = await _context.Tasks.CountAsync(t => t.Status == "Done");
            var overdue = await _context.Tasks.CountAsync(t => t.Status == "InProgress" && t.DueDate < DateTime.Now);

            var Summary = new TaskSummaryDto
            {
                Total = total,
                Completed = completed,
                Overdue = overdue,
            };

            return Ok(Summary);
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<Task>>> GetUpcomingTasks()
        {
            var today = DateTime.Today;
            var nextDays = today.AddDays(2);

            var tasks = await _context.Tasks
                .Where(t => t.Status == "InProgress" && t.DueDate >= today && t.DueDate <= nextDays)
                .OrderBy(t => t.DueDate)
                .ToListAsync(); ;

            return Ok(tasks);
        }

        [HttpGet("productivity")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductivity()
        {
            //data for last 7 days
            var startDate = DateTime.Today.AddDays(-6);

            var completedTasks = await _context.Tasks
                .Where(t => t.Status == "Done" && t.DueDate >= startDate)
                .ToListAsync();

            var chartData = Enumerable.Range(0, 7).Select(i =>
            {
                var day = startDate.AddDays(i);
                var count = completedTasks.Count(t => t.DueDate.Value.Date == day.Date);
                return new { day = day.DayOfWeek.ToString(), completed = count };
            }).ToList();

            return Ok(chartData);
        }

    }
}

