using Microsoft.EntityFrameworkCore;
using smart_task_manager.Data;
using smart_task_manager.Models;

namespace smart_task_manager.Services
{
    // 1. INTERFACE (the contract) - separate from the class
    public interface ITaskService
    {
        Task<List<TaskItem>> GetAll();
        Task<TaskItem?> GetTaskById(string id);
        Task<TaskItem?> CreateTask(TaskItem task, string userId);
        Task<bool> DeleteTask(string id);
        Task<bool> UpdateTask(TaskItem updatedTask, string userId);
    }

    // 2. SERVICE CLASS (the implementation)
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        // gives service access to the database
        public TaskService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<List<TaskItem>> GetAll()
        {
            return await _context.Tasks.ToListAsync();
        }

        public async Task<TaskItem?> GetTaskById(string id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task<TaskItem?> CreateTask(TaskItem task, string userId)
        {
            task.UserId = userId;

            // Add the new task to the database context
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            var notification = new Notification
            {
                UserId = userId,
                TaskId = task.Id,
                title = $"New Task Created: {task.Title}", // ✅ Add this
                Message = $"Task '{task.Title}' has been created",
                CreatedAt = DateTime.Now,
                IsRead = false
            };
            // Create a notification for this task
            await _notificationService.CreateNotification(notification);

            return task;
        }

        public async Task<bool> DeleteTask(string id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTask(TaskItem updatedTask, string userId)
        {
            var existingTask = await _context.Tasks.FindAsync(updatedTask.Id);

            if (existingTask == null)
                return false;

            // Check if relevant fields changed
            bool statusChanged = existingTask.Status != updatedTask.Status;
            bool dueDateChanged = existingTask.DueDate != updatedTask.DueDate;

            // update fields
            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.DueDate = updatedTask.DueDate;
            existingTask.Status = updatedTask.Status;

            _context.Tasks.Update(existingTask);
            await _context.SaveChangesAsync();

            // Send notification if status or due date changed
            if (statusChanged || dueDateChanged)
            {
                await _notificationService.CreateNotification(new Notification
                {
                    UserId = existingTask.UserId,
                    Message = $"Task '{existingTask.Title}' updated. " +
                              $"{(statusChanged ? $"Status changed to {existingTask.Status}. " : "")}" +
                              $"{(dueDateChanged ? $"Due date changed to {existingTask.DueDate:yyyy-MM-dd}." : "")}",
                    TaskId = existingTask.Id
                });
            }

            return true;
        }
    }
}
 