/*using Microsoft.EntityFrameworkCore;
using smart_task_manager.Data;
using smart_task_manager.Models;
using System.Threading.Tasks;

namespace smart_task_manager.Services
{
    public interface INotificationService
    {
        Task<List<Notification>> GetAllNotifications();
        Task<List<Notification>> GetAllUnreadNotifications();
        Task<Notification> GetNotificationById(int id);
        Task<bool> DeleteAllNotifications();
        Task<bool> DeleteNotificationById(int id);
        Task<bool> MarkNotificationAsReadAsync(int id);
        Task CreateNotification(Notification notification);
    }
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        //Constructor
        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        //Get all notifications
        public async Task<List<Notification>> GetAllNotifications()
        {
            return await _context.Notifications.ToListAsync();

        }
        // Get all UNREAD notifications
        public async Task<List<Notification>> GetAllUnreadNotifications()
        {
            return await _context.Notifications
                .Where(n => !n.IsRead) // Assuming you have an IsRead property
                .ToListAsync();
        }
        public async Task<Notification> GetNotificationById(int id)
        {
            return await _context.Notifications.FindAsync(id);
        }
        public async Task<bool> DeleteAllNotifications()
        {
            var notifications = await _context.Notifications.ToListAsync();
            // Check if there are any notifications to delete
            if (notifications == null || !notifications.Any())
                return false;
            _context.Notifications.RemoveRange(notifications);
            // 4. Save changes to database
            await _context.SaveChangesAsync();

            // 5. Return true for success
            return true;
        }
        public async Task<bool> DeleteNotificationById(int id)
        {
            var Notification = await _context.Notifications.FindAsync(id);
            // 2. If Notification doesn't exist, return false
            if (Notification == null)
                return false;
            _context.Notifications.Remove(Notification);
            // 4. Save changes to database
            await _context.SaveChangesAsync();

            // 5. Return true for success
            return true;
        }
        // Mark a notification as read
        public async Task<bool> MarkNotificationAsReadAsync(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task CreateNotification(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
    }

}*/