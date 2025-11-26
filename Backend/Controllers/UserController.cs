using Microsoft.AspNetCore.Mvc;
using smart_task_manager.Models;
using smart_task_manager.DTOs;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore; 

namespace smart_task_manager.Controllers
{
    [ApiController]
    [Route("api/User")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return Ok(user);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            // Update username
            if (!string.IsNullOrEmpty(dto.UserName))
            {
                var existingUser = await _userManager.FindByNameAsync(dto.UserName);
                if (existingUser != null && existingUser.Id != user.Id)
                    return BadRequest(new { message = "Username is already taken" });

                user.UserName = dto.UserName;
                user.NormalizedUserName = dto.UserName.ToUpper();
            }

            // Update email
            if (!string.IsNullOrEmpty(dto.Email))
            {
                var existingUser = await _userManager.FindByEmailAsync(dto.Email);
                if (existingUser != null && existingUser.Id != user.Id)
                    return BadRequest(new { message = "Email is already in use" });

                user.Email = dto.Email;
                user.NormalizedEmail = dto.Email.ToUpper();
            }

            // Update phone number
            if (!string.IsNullOrEmpty(dto.PhoneNumber))
                user.PhoneNumber = dto.PhoneNumber;

            // Update mode
            if (!string.IsNullOrEmpty(dto.Mode))
                user.Mode = dto.Mode;

            // Save changes
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                mode = user.Mode,
                role = user.Role
            });
        }
    }
}
