using Microsoft.AspNetCore.Mvc;
using smart_task_manager.Models;
using smart_task_manager.Services;
using Microsoft.AspNetCore.Authorization;

namespace smart_task_manager.Controllers
{
    [ApiController] // tells ASP.NET this is an API controller
    [Route("api/tasks")] //  sets base URL to api/tasks
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }
        //Get : get all tasks
        [Authorize(Roles = "Manager,User")]
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
           var  result = await _taskService.GetAll();
            return Ok(result);

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTasksById(int id)
        {
            var task = await _taskService.GetTaskById(id);
            if (task == null) return NotFound();
            return Ok(task);
        }
       [Authorize(Roles = "Manager,User")]
        [HttpPost]
        public async Task<IActionResult> createTask(TaskItem task)
        {
            var newTask = await _taskService.CreateTask(task);
            return Ok(newTask);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {    // find the task first
            var task = await _taskService.GetTaskById(id);
            if (task == null) return NotFound();
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
        public async Task<IActionResult> UpdateTask(int id, TaskItem task)
        { var existing = await _taskService.GetTaskById(id);
            if (existing == null) return NotFound();
            var result = await _taskService.UpdateTask(task);
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

