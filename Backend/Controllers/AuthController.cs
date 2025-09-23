using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using smart_task_manager.Services;
using smart_task_manager.DTOs;
namespace smart_task_manager.Controllers
{
    [ApiController] // tells ASP.NET this is an API controller
    [Route("api/auth")] //  sets base URL to api/auth
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
    }
}