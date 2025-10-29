using Microsoft.AspNetCore.Mvc;
using smart_task_manager.Models;
using smart_task_manager.Services;
using smart_task_manager.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace smart_task_manager.Controllers
{
    [ApiController] // tells ASP.NET this is an API controller
    [Route("api/tasks")] //  sets base URL to api/tasks
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly UserManager<User> _userManager;

        public TaskController(ITaskService taskService , UserManager<User> userManager)
        {
            _taskService = taskService;
            _userManager = userManager;
        }
        //Get : get all tasks
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
           var  result = await _taskService.GetAll();
            return Ok(result);

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTasksById(string Id)
        {  
            var task = await _taskService.GetTaskById(Id);
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
        public async Task<IActionResult> UpdateTask( TaskItem task , string id)
        { var existing = await _taskService.GetTaskById(id);
            if (existing == null) return NotFound();
            var result = await _taskService.UpdateTask(task, id);
            if (result)
            {
                // Return 200 OK with success message
                return Ok($"Task with ID {id} was updated successfully.");
            }
            else
            {
                // Return 400 Bad Request if something went wrong
                return BadRequest($"Failed to update task with ID {id}.");
            }
        }
    }
}

