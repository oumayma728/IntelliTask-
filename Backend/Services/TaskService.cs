using Microsoft.EntityFrameworkCore;
using smart_task_manager.Data;
using smart_task_manager.Models;

namespace smart_task_manager.Services
{
    // 1. INTERFACE (the contract) - separate from the class
    public interface ITaskService
    {
        Task<List<TaskItem>> GetAll();
        Task<TaskItem?> GetTaskById(int id);
        //Task<TaskItem?> CreateTask(TaskItem task); // ← Changed from createTask to CreateTask
        Task<bool> DeleteTask(int id);
        //Task<bool> UpdateTask(TaskItem updatedTask);
    } // ← Interface ends here

    // 2. SERVICE CLASS (the implementation) - at same level as interface
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;
        //private readonly NotificationService _notificationService;


        //gives service access to the database
        public TaskService(AppDbContext context/*, NotificationService notificationService*/)
        {
            _context = context;
            //_notificationService = notificationService;
        }

        public async Task<List<TaskItem>> GetAll()
        {
            return await _context.Tasks.ToListAsync();
        }

        public async Task<TaskItem?> GetTaskById(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        /*public async Task<TaskItem?> CreateTask(TaskItem task) // ← Changed from createTask to CreateTask
        {
            // Add the new task to the database context
            _context.Tasks.Add(task);

            // Save the changes to actually write to the database
            await _context.SaveChangesAsync();
            await _notificationService.CreateNotification(new Notification
            {
                UserId = task.UserId,
                Message = $"A new task '{task.Title}' has been assigned to you.",
                TaskId = task.Id
            });
            // Return the created task (now it has an ID from the database)
            return task;
        }*/

        public async Task<bool> DeleteTask(int id)
        {
            // 1. Find the task
            var task = await _context.Tasks.FindAsync(id);

            // 2. If task doesn't exist, return false
            if (task == null)
                return false;

            // 3. If task exists, remove it
            _context.Tasks.Remove(task);

            // 4. Save changes to database
            await _context.SaveChangesAsync();

            // 5. Return true for success
            return true;
        }

        /*public async Task<bool> UpdateTask(TaskItem updatedTask)
        {
            var ExistingTask = await _context.Tasks.FindAsync(updatedTask.Id);

            if (ExistingTask == null)
                return false;
            // Check if relevant fields changed
            bool statusChanged = ExistingTask.Status != updatedTask.Status;
            bool dueDateChanged = ExistingTask.DueDate != updatedTask.DueDate;

            // update fields
            ExistingTask.Title = updatedTask.Title;
            ExistingTask.Description = updatedTask.Description;
            ExistingTask.DueDate = updatedTask.DueDate;
            ExistingTask.Status = updatedTask.Status;

            _context.Tasks.Update(ExistingTask);

            // Save changes to database
            await _context.SaveChangesAsync();
            // Send notification if status or due date changed
            if (statusChanged || dueDateChanged)
            {
                await _notificationService.CreateNotification(new Notification
                {
                    UserId = ExistingTask.UserId,
                    Message = $"Project '{ExistingTask.Title}' updated. " +
                      $"{(statusChanged ? $"Status changed to {ExistingTask.Status}. " : "")}" +
                      $"{(dueDateChanged ? $"Due date changed to {ExistingTask.DueDate:yyyy-MM-dd}." : "")}",
                    TaskId = ExistingTask.Id

                });
                // Return true for success

            }
            return true;

        }*/
    }
}