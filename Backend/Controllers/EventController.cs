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
        //private readonly GoogleCalendarService _googleCalendarService;

        public EventController(IEventService eventService, UserManager<User> userManager)
        {
            _eventService = eventService;
            _userManager = userManager;
            //_googleCalendarService = googleCalendarService;
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
        public async Task<IActionResult> GetEventById(int id)
        {
            var ev = await _eventService.GetEventById(id);
            if (ev == null)
                return NotFound(new { message = $"Event with ID {id} not found." });

            return Ok(ev);
        }

        /*[HttpPost("google-events")]
        public async Task<IActionResult> CreateGoogleEvent([FromBody] Event ev)
        {
            if (ev.StartDate.HasValue && ev.EndDate.HasValue)
            {
                await _googleCalendarService.AddEventAsync(ev.Title, ev.StartDate.Value, ev.EndDate.Value);
                return Ok(new { message = "Event added to Google Calendar!" });
            }
            return BadRequest("StartDate and EndDate are required.");
        }*/

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
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] Event updatedEvent)
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


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var result = await _eventService.DeleteEvent(id);
            if (!result)
                return BadRequest($"Failed to delete event with ID {id}.");

            return Ok(new { message = $"Event with ID {id} was deleted successfully." });
        }
    }
}
