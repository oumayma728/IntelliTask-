using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity; // For UserManager and SignInManager
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using smart_task_manager.Services;
using smart_task_manager.Models;
using smart_task_manager.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace SmartTaskManager.Backend.Tests.Unit
{
    public class AuthServiceTests
    {
        private readonly Mock<UserManager<User>> _userManagerMock; //mock version of UserManager
        private readonly Mock<SignInManager<User>> _signInManagerMock; //mock version of SignInManager
        private readonly Mock<IConfiguration> _configurationMock; //mock version of IConfiguration
        private readonly AuthService _authService; //the service being tested

        public AuthServiceTests()
        {
            // Mock UserManager
            var userStoreMock = new Mock<IUserStore<User>>(); //mock user store
            _userManagerMock = new Mock<UserManager<User>>( 
                userStoreMock.Object,
                null, null, null, null, null, null, null, null
            );

            // Mock SignInManager dependencies
            var contextAccessorMock = new Mock<IHttpContextAccessor>();
            var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<User>>();
            var optionsMock = new Mock<IOptions<IdentityOptions>>();
            var loggerMock = new Mock<ILogger<SignInManager<User>>>();
            var schemeProviderMock = new Mock<IAuthenticationSchemeProvider>();
            var userConfirmationMock = new Mock<IUserConfirmation<User>>();

            _signInManagerMock = new Mock<SignInManager<User>>(
                _userManagerMock.Object,
                contextAccessorMock.Object,
                claimsFactoryMock.Object,
                optionsMock.Object,
                loggerMock.Object,
                schemeProviderMock.Object,
                userConfirmationMock.Object
            );

            // Mock IConfiguration
            _configurationMock = new Mock<IConfiguration>();
            _configurationMock.Setup(c => c["Jwt:Secret"]).Returns("supersecretkey123456");

            // Create AuthService instance with mocks
            _authService = new AuthService(
                _userManagerMock.Object,
                _signInManagerMock.Object,
                _configurationMock.Object
            );
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnSuccess_WhenUserCreated()
        {
            // Arrange
            _userManagerMock
                .Setup(u => u.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _authService.RegisterAsync("test@gmail.com", "Password123");

            // Assert
            Assert.True(result.Succeeded);
        }

       

    
    }
}
