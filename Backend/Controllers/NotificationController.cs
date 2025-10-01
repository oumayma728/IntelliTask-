using Microsoft.AspNetCore.Mvc;
using smart_task_manager.Services;
using smart_task_manager.Models;
namespace smart_task_manager.Controllers
{
    [ApiController] // tells ASP.NET this is an API controller
    [Route("api/notifications")] //  sets base URL to api/projects
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNotifications()
        {
            var notifications = await _notificationService.GetAllNotifications();
            return Ok(notifications);
        }
        [HttpGet("unread")]
        public async Task<IActionResult> GetAllUnreadNotifications()
        {
            var UnreadNotifications = await _notificationService.GetAllUnreadNotifications();
            return Ok(UnreadNotifications);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationById(int id)
        {
            var Notification = await _notificationService.GetNotificationById(id);
            if (Notification == null) return NotFound();
            return Ok(Notification);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotificationById(int id)
        {
            var notification = await _notificationService.GetNotificationById(id);
            if (notification == null)
                return NotFound($"Notification with id {id} not found");

            var result = await _notificationService.DeleteNotificationById(id);
            if (result)
            {
                return Ok($"notification with {id} deleted successfully");
            }
            else
            {
                return BadRequest($"Failed to delete notifications");
            }
        }

        //Mark notification as read
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var result = await _notificationService.MarkNotificationAsReadAsync(id);
            if (result)
            {
                return Ok($"Notification with ID {id} marked as read");
            }
            else
            {
                return NotFound($"Notification with ID {id} not found");
            }
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteAllNotifications()
        {
            var notification = await _notificationService.GetAllNotifications();
            if (notification == null)
                return null;
            var result = await _notificationService.DeleteAllNotifications();
            if (result)
            {
                return Ok($"notifications deleted successfully");
            }
            else
            {
                return BadRequest($"Failed to delete notifications");
            }
            }
        }
    }

