using Microsoft.EntityFrameworkCore;
using smart_task_manager.Data;
using smart_task_manager.Models;
using smart_task_manager.Services;

namespace smart_task_manager.Services
{
    public interface IEventService
    {
        Task<List<Event>> GetAll();
        Task<Event?> GetEventById(int id);
        Task<Event?> CreateEvent(Event ev, string userId);
        Task<bool> DeleteEvent(int id);
        Task<bool> UpdateEvent(Event updatedEvent, int id);
    }

    // ✅ IMPLEMENTATION CLASS
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public EventService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;

        }

        // ✅ GET all events
        public async Task<List<Event>> GetAll()
        {
            return await _context.Events.ToListAsync();
        }

        // ✅ GET event by ID
        public async Task<Event?> GetEventById(int id)
        {
            return await _context.Events.FindAsync(id);
        }

        // ✅ CREATE event
        public async Task<Event?> CreateEvent(Event ev, string userId)
        {
            ev.UserId = userId;

            _context.Events.Add(ev);
            await _context.SaveChangesAsync();

            /* Create a notification when a new event is created
            var notification = new Notification
            {
                UserId = userId,
                EventId = ev.Id,
                Title = $"New Event Created: {ev.Title ?? "Untitled"}",
                Message = $"Event '{ev.Title}' scheduled from {ev.StartDate} to {ev.EndDate}"
            };

            await _notificationService.CreateNotification(notification);
*/
            return ev;
        }

        public async Task<bool> DeleteEvent(int id)
        {
            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
                return false;

            // Delete related notifications first
          /*  var relatedNotifications = _context.Notifications
                .Where(n => n.EventId == id);
            _context.Notifications.RemoveRange(relatedNotifications);
          */
            // Delete event
            _context.Events.Remove(existingEvent);
            await _context.SaveChangesAsync();

            return true;
        }

        // ✅ UPDATE event
        public async Task<bool> UpdateEvent(Event updatedEvent, int id)
        {
            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
                return false;

            // Update basic fields
            existingEvent.Title = updatedEvent.Title;
            existingEvent.Description = updatedEvent.Description;
            existingEvent.StartDate = updatedEvent.StartDate;
            existingEvent.EndDate = updatedEvent.EndDate;

            await _context.SaveChangesAsync();

            /* Send notification for update
            await _notificationService.CreateNotification(new Notification
            {
                UserId = existingEvent.UserId,
                EventId = existingEvent.Id,
                Title = "Event Updated",
                Message = $"Event '{existingEvent.Title}' was updated."
            });*/

            return true;
        }
    }
}
