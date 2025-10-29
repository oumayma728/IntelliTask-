using Microsoft.AspNetCore.Mvc;
using smart_task_manager.Models;
using smart_task_manager.Services;
using smart_task_manager.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace smart_task_manager.Controllers
{
    [ApiController]
    [Route("api/events")] // Base route for this controller
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly UserManager<User> _userManager;

        public EventController(IEventService eventService, UserManager<User> userManager)
        {
            _eventService = eventService;
            _userManager = userManager;
        }

        // ✅ GET: /api/events
        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var result = await _eventService.GetAll();
            return Ok(result);
        }

        // ✅ GET: /api/events/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEventById(string id)
        {
            var ev = await _eventService.GetEventById(id);
            if (ev == null)
                return NotFound(new { message = $"Event with ID {id} not found." });

            return Ok(ev);
        }

        // ✅ POST: /api/events
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid event data.");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var ev = new Event
            {
                Title = dto.Title,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Description = dto.Description,
                UserId = userId
            };

            var newEvent = await _eventService.CreateEvent(ev, userId);
            return Ok(newEvent);
        }

        // ✅ PUT: /api/events/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(string id, [FromBody] Event updatedEvent)
        {
            if (updatedEvent == null)
                return BadRequest("Invalid event data.");

            var existing = await _eventService.GetEventById(id);
            if (existing == null)
                return NotFound(new { message = $"Event with ID {id} not found." });

            var result = await _eventService.UpdateEvent(updatedEvent, id);
            if (!result)
                return BadRequest($"Failed to update event with ID {id}.");

            return Ok(new { message = $"Event with ID {id} was updated successfully." });
        }

        // ✅ DELETE: /api/events/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(string id)
        {
            var result = await _eventService.DeleteEvent(id);
            if (!result)
                return BadRequest($"Failed to delete event with ID {id}.");

            return Ok(new { message = $"Event with ID {id} was deleted successfully." });
        }
    }
}
