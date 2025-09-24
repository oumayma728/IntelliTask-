using Microsoft.AspNetCore.Mvc;
using smart_task_manager.Models;
using smart_task_manager.Services;
using Microsoft.AspNetCore.Authorization;

namespace smart_task_manager.Controllers
{
    [ApiController] // tells ASP.NET this is an API controller
    [Route("api/projects")] //  sets base URL to api/projects
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }
        //Get : get all projects
        [Authorize(Roles = "Manager,User")]
        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {

            var projects = await _projectService.GetAll();
            return Ok(projects);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _projectService.GetProjectById(id);
            if (project == null) return NotFound();
            return Ok(project);
        }
        [Authorize(Roles = "Manager")]
        [HttpPost]
        public async Task<IActionResult> createProject(Project Project)
        {
            var result = await _projectService.CreateProject(Project);
            return Ok(result);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] Project updatedProject)
        {
            var Project = await _projectService.GetProjectById(id);
            if (Project == null) return NotFound();
            var result = await _projectService.UpdateProject(updatedProject);
            if (result)
            {
                // Return 200 OK with success message
                return Ok($"Project with ID {id} was updated successfully.");
            }
            else
            {
                // Return 400 Bad Request if something went wrong
                return BadRequest($"Failed to update Project with ID {id}.");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {    // find the task first
            var task = await _projectService.GetProjectById(id);
            if (task == null) return NotFound();
            var result = await _projectService.DeleteProject(id);
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

    }
}
