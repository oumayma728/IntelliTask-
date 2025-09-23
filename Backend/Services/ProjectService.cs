using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using smart_task_manager.Data;
using smart_task_manager.Models;

namespace smart_task_manager.Services
{
    // 1. INTERFACE (the contract) - separate from the class
    public interface IProjectService
    {
        Task<List<Project>> GetAll();
        Task<Project> GetProjectById(int id);
        //Task<Project> CreateProject(Project project);
        //Task<bool> UpdateProject(Project UpdatedProject);
        Task<bool> DeleteProject(int id);
    }

    // 2. SERVICE CLASS (the implementation) - at same level as interface
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;
       // private readonly NotificationService _notificationService;


        // Constructor - gives service access to the database
        public ProjectService(AppDbContext context /*, NotificationService notificationService*/)
        {
            _context = context;
           // _notificationService = notificationService;
        }

        // Get all projects
        public async Task<List<Project>> GetAll()
        {
            return await _context.Projects.ToListAsync();
        }

        // Get project by ID
        public async Task<Project> GetProjectById(int id)
        {
            return await _context.Projects.FindAsync(id);
        }
        // Create a new project
        /*public async Task<Project> CreateProject(Project project)
        {
            // Add the new project to the database context
            _context.Projects.Add(project);

            // Save the changes to actually write to the database
            await _context.SaveChangesAsync();
            await _notificationService.CreateNotification(new Notification
            {
                UserId = project.UserId,
                Message = $"A new project '{project.Name}' .",
                ProjectId = project.Id
            });
            // Return the created project (now it has an ID from the database)
            return project;
        }*/

        // Update project
       /* public async Task<bool> UpdateProject(Project UpdatedProject)
        {
            var ExistingProject = await _context.Projects.FindAsync(UpdatedProject.Id);
            if (ExistingProject == null)
                return false;
            // Check if relevant fields changed
            bool statusChanged = ExistingProject.Status != UpdatedProject.Status;
            bool dueDateChanged = ExistingProject.DueDate != UpdatedProject.DueDate;
            // Update only the fields we want to allow
            ExistingProject.Name = UpdatedProject.Name;
            ExistingProject.Description = UpdatedProject.Description;
            ExistingProject.DueDate = UpdatedProject.DueDate;
            ExistingProject.Status = UpdatedProject.Status;

            // Save changes to database
            await _context.SaveChangesAsync();
            if (statusChanged || dueDateChanged)
            {
                await _notificationService.CreateNotification(new Notification
                {
                    UserId = ExistingProject.UserId,
                    Message = $"Project '{ExistingProject.Name}' updated. " +
                      $"{(statusChanged ? $"Status changed to {ExistingProject.Status}. " : "")}" +
                      $"{(dueDateChanged ? $"Due date changed to {ExistingProject.DueDate:yyyy-MM-dd}." : "")}",
                    ProjectId = ExistingProject.Id

                });
                // Return true for success
            }
            return true;

        }
       */
        // Delete project - FIXED variable names
        public async Task<bool> DeleteProject(int id)
        {
            // 1. Find the project
            var project = await _context.Projects.FindAsync(id); // Changed from 'Projects' to 'project'

            // 2. If project doesn't exist, return false
            if (project == null)
                return false;

            // 3. If project exists, remove it
            _context.Projects.Remove(project); // Changed from 'task' to 'project'

            // 4. Save changes to database
            await _context.SaveChangesAsync();

            // 5. Return true for success
            return true;
        }
    }
}