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
        Task<IdentityResult> ResetPassword(string email, string NewPassword);
    }

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
            _jwtSecret = config["Jwt:Secret"];
        }

        public async Task<IdentityResult> RegisterAsync(string email, string password)
        {
            var user = new User
            {
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
        private string GenerateJwtToken(User user)
        {
            // Debug: Check the user object
            Console.WriteLine($"User Id: '{user.Id}'");
            Console.WriteLine($"User Email: '{user.Email}'");
            Console.WriteLine($"User Name: '{user.UserName}'");

            if (string.IsNullOrEmpty(user.Id))
            {
                throw new ArgumentException("User Id cannot be null or empty");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            // Create claims with multiple identifier types
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id), // This is the most important one
        new Claim("sub", user.Id), // JWT standard subject claim
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Role, user.Role.ToString()),
        new Claim("userid", user.Id), // Custom claim as backup
        new Claim("id", user.Id) // Another backup
    };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Debug: Check the generated token
            var generatedToken = tokenHandler.WriteToken(token);
            Console.WriteLine($"Generated token for user: {user.Email}, ID: {user.Id}");

            return generatedToken;
        }


        public async Task<IdentityResult> ResetPassword(string email, string NewPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return IdentityResult.Failed(new IdentityError { Description = "User not found." });

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, NewPassword);
            return result; // ✅ return IdentityResult
        }

    }
}

