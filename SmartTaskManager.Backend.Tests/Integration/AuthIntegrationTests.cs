using System.Net;
using System.Net.Http.Json;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using FluentAssertions;
using smart_task_manager.DTOs;
using smart_task_manager.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;      // Dictionary for in-memory settings
using System.Threading.Tasks;          // async/await
using Microsoft.Extensions.Options;          // async/await

using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using smart_task_manager.Models;
using smart_task_manager.DTOs;
using Microsoft.Extensions.Logging;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity.Data;
using smart_task_manager.Data;
namespace SmartTaskManager.Backend.Tests.Integration
{ 
    public class AuthServiceIntegrationsTests
    {
        private readonly AuthService _authService;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly string _jwtSecret;

        public AuthServiceIntegrationsTests()
        {
            // setup in-memory database
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())   
                .Options;
            var context = new AppDbContext(options);

            // setup UserStore and UserManager
            var userStore = new UserStore<User>(context);
            _userManager = new UserManager<User>(
                userStore,
                null,
                new PasswordHasher<User>(),
                Array.Empty<IUserValidator<User>>(),
                Array.Empty<IPasswordValidator<User>>(),
                new UpperInvariantLookupNormalizer(),
                new IdentityErrorDescriber(),
                null,
                new Logger<UserManager<User>>(new LoggerFactory())
            );

            // setup SignInManager
            var contextAccessor = new HttpContextAccessor();
            var identityOptions = Options.Create(new IdentityOptions());
            var claimsFactory = new UserClaimsPrincipalFactory<User>(_userManager, identityOptions);

            _signInManager = new SignInManager<User>(
                _userManager,
                contextAccessor,
                claimsFactory,
                null,
                null,
                null,
                null
            );

            // setup IConfiguration
            var inMemorySettings = new Dictionary<string, string>
    {
        { "Jwt:Secret", "ThisIsATestSecretKeyForUnitTests12345" }
    };
            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            // create AuthService
            _authService = new AuthService(_userManager, _signInManager, _configuration);
        }


        [Fact]
        public async Task RegisterAsync_ShouldCreateUserInDb()
        {
            var result = await _authService.RegisterAsync("newUser@gmail.com", "NewUser@123");
            Assert.True(result.Succeeded);

            var user = await _userManager.FindByEmailAsync("newUser@gmail.com");
            Assert.NotNull(user);
        }
        [Fact]
        public async Task LoginAsync_ShouldReturnToken_WhenCredentialsValid()
        {
            //register a user first
            var result = await _authService.RegisterAsync("newUser@gmail.com", "NewUser@123");

            var loginResult = await _authService.LoginAsync("newUser@gmail.com", "NewUser@123");
            Assert.NotNull(loginResult);
            Assert.NotNull(loginResult.Token);

        }


    }

}