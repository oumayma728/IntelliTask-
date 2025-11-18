using Microsoft.AspNetCore.Mvc;
using System.Net.Http; // used to send HTTP requests 
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/ChatBot")] // fixed route typo
    public class ChatBotController : ControllerBase
    {
        private readonly string apiKey; // gets API key from appsettings.json
        private readonly HttpClient http;

        public ChatBotController(IConfiguration configuration)
        {
            // read api key 
            this.apiKey = configuration.GetValue<string>("apiKey") ?? "";

            // Creates an HTTP client to send requests to the Mistral API
            this.http = new HttpClient();
            if (!string.IsNullOrEmpty(apiKey))
            {
                http.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", apiKey);
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChatBot([FromBody] ChatRequest request)
        {
            try
            {
                // input validation
                if (request == null || string.IsNullOrEmpty(request.UserInput))
                    return BadRequest(new { error = "User input cannot be empty" });

                if (string.IsNullOrEmpty(apiKey))
                    return BadRequest(new { error = "API Key is not configured" });

                // Mistral request 
                var body = new
                {
                    model = "mistral-large-latest", // comma added
                    messages = new[] // array of objects
                    {
                        new { role = "user", content = request.UserInput }
                    }
                };

                // serialize to JSON
                var json = JsonSerializer.Serialize(body);

                // send POST request
                var response = await http.PostAsync(
                    "https://api.mistral.ai/v1/chat/completions", // sends POST request to Mistral
                    new StringContent(json, Encoding.UTF8, "application/json")
                );

                response.EnsureSuccessStatusCode(); // check response

                var responseJson = await response.Content.ReadAsStringAsync(); // reads response as string
                var responseData = JsonDocument.Parse(responseJson);

                // extract the AI answer
                string answer = responseData.RootElement
                    .GetProperty("choices")[0] // first choice returned
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString() ?? "";

                return Ok(new { answer });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(new { error = "An error occurred: " + ex.Message });
            }
        }
    }
}
