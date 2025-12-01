/*using System.Net;
using System.Net.Http.Json;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using FluentAssertions;
using smart_task_manager.DTOs;

namespace SmartTaskManager.Backend.Tests.Integration
{
	public class AuthIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
	{
		
		private readonly HttpClient _client; //http client to send requests to the test server
		public AuthIntegrationTests(WebApplicationFactory<Program> factory)
		{
			_client = factory.CreateClient(); //create http client from the factory
		}
		[Fact]
		public async void Login_ReturnsToken_WhenCredentialsValid()
		{
			var loginData = new
			{
				Email = "test@gmail.com",
				Password = "Password123"

			};

			var response = await _client.PostAsJsonAsync("/api/auth/login", loginData);
			response.StatusCode.Should().Be(HttpStatusCode.OK);

			var result = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
			result.Token.Should().NotBeNullOrEmpty();
		}




	}
}*/