using Microsoft.AspNetCore.Identity;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using smart_task_manager.Models;
using smart_task_manager.DTOs;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity.Data;

namespace smart_task_manager.Services
{
    // 1. INTERFACE (the contract) - separate from the class
    public interface IAuthService
    {
        Task<IdentityResult> RegisterAsync(string email, string password);  
        Task<LoginResponseDto?> LoginAsync(string email, string password);
    } // ← Interface ends here

    // 2. SERVICE CLASS (the implementation) - at same level as interface
    public class AuthService : IAuthService
    {
        //class provided by ASP.NET
        //manages users in your system
        private readonly UserManager<User> _userManager;
        //handle login logic
        private readonly SignInManager<User> _signInManager;
        private readonly string _jwtSecret;

        //Constructor: This runs when you create an instance of AuthService.
        public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtSecret = config["Jwt:Secret"];        }

        public async Task<IdentityResult> RegisterAsync(string email, string password)
        {
            var user = new User {
                UserName = email,
                Email = email,          // use the method parameter
                Role = UserRole.User,
                Mode = "personal"
            };
            return await _userManager.CreateAsync(user, password); // returns IdentityResult
        }


        public async Task<LoginResponseDto?> LoginAsync(string email, string password)
        //returns a string (token) or null
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return null;

            var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
            if (!result.Succeeded) return null;
            return new LoginResponseDto
            {
                Token = GenerateJwtToken(user),
                Mode = user.Mode,
                Email = user.Email,
                Username = user.UserName
            };
        }
        
        private string GenerateJwtToken(User user) // ← Changed from IdentityUser to User
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role.ToString())

                }),
                Expires = DateTime.UtcNow.AddHours(2),
                //Claims: little pieces of info about the user (here: their Id and Email).
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                //SigningCredentials: how we sign it(with the secret key and SHA256 encryption).
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}