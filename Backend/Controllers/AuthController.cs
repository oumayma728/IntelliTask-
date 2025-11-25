using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using smart_task_manager.Services;
using smart_task_manager.DTOs;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using smart_task_manager.Data;
using Microsoft.EntityFrameworkCore;
namespace smart_task_manager.Controllers
{
    [ApiController] // tells ASP.NET this is an API controller
    [Route("api/auth")] //  sets base URL to api/auth
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly AppDbContext _context;

        public AuthController(IAuthService authService , AppDbContext context)
        {
            _authService = authService;
            _context = context;
        }
        // POST: AuthController/Create
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto.Email, dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors); // now you can access Errors
            }

            return Ok("User created successfully");
        }


        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto.Email, dto.Password);
            if (token == null)
            {
                return Unauthorized("Invalid credentials");
            }
            return Ok(new {token});
        }

        [HttpPost("ChangePassword")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto model)
        {
            // 1. Find the user by ID (or email if you prefer)
            var user = await _context.Users.FindAsync(model.UserId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            // 2. Normalize the hash to avoid "Invalid salt version"
            var storedHash = user.PasswordHash;
            if (storedHash.StartsWith("$2y$"))
            {
                storedHash = storedHash.Replace("$2y$", "$2a$");
            }

            // 3. Verify the current password
            bool isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(model.CurrentPassword, storedHash);
            if (!isCurrentPasswordValid)
                return BadRequest(new { message = "Current password is incorrect." });

            // 4. Hash the new password and update the user
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);

            await _context.SaveChangesAsync();

            // 5. Return success
            return Ok(new { message = "Password updated successfully." });
        }

    }
}