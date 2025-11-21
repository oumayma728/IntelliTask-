using Google.Apis.Auth.OAuth2; // Access tokens and credentials
using Google.Apis.Auth.OAuth2.Flows; 
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Microsoft.AspNetCore.Mvc;

namespace smart_task_manager.Controllers
{
    [ApiController]
    [Route("api/google-calendar")]
    public class CalendarController : Controller
    {
        private readonly IConfiguration _config;

        public CalendarController(IConfiguration config)
        {
            _config = config;
        }

        //Redirect user to Google login
        [HttpGet("login")]
        public IActionResult Login()
        {//read for appsettings.json
            var clientId = _config["GoogleOAuth:ClientId"];
            var clientSecret = _config["GoogleOAuth:ClientSecret"];
            var redirectUri = _config["GoogleOAuth:RedirectUri"];

            //This URL opens Google’s Login Page
            string oauthUrl =
                "https://accounts.google.com/o/oauth2/v2/auth" + //Google OAuth authorization
                "?response_type=code" + //Give me a code after login
                $"&client_id={clientId}" + //gives google client_id
                $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +  //send the user back here after login
                "&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly%20email%20profile" + //Tells Google what your app can access(calendar , email , profile info)
                "&access_type=offline" + //get a refresh token ( so can the app read the calendar even when the user is offline)
                "&prompt=consent"; // always show the premission screen

            return Redirect(oauthUrl);
        }

        // the callback is where Google SENDS you the temporary code
        [HttpGet("callback")] //Google calls back to after login
        public async Task<IActionResult> Callback(string code)
        {
            try
            {
                if (string.IsNullOrEmpty(code))
                    return BadRequest("Authorization code is missing");

                var clientId = _config["GoogleOAuth:ClientId"];
                var clientSecret = _config["GoogleOAuth:ClientSecret"];
                var redirectUri = _config["GoogleOAuth:RedirectUri"];
                var frontendUrl = _config["GoogleOAuth:FrontendUrl"];

                if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                    return StatusCode(500, "Google OAuth configuration missing");

                var flow = new GoogleAuthorizationCodeFlow( // manage Google OAuth Authorization Code flow
                    new GoogleAuthorizationCodeFlow.Initializer
                    {
                        ClientSecrets = new ClientSecrets
                        {
                            ClientId = clientId,
                            ClientSecret = clientSecret
                        }
                    });

                var token = await flow.ExchangeCodeForTokenAsync(
                    "user", 
                    code, 
                    redirectUri,
                    CancellationToken.None);

                // redirect to react with the tokens
                var redirectUrl = $"{frontendUrl}/calendar?" +
                                  $"accessToken={token.AccessToken}&" +
                                  $"refreshToken={token.RefreshToken}&" +
                                  $"expiresIn={token.ExpiresInSeconds}";

                return Redirect(redirectUrl); // React can read tokens from URL
            }
            catch (Exception ex)
            {
                var frontendUrl = _config["GoogleOAuth:FrontendUrl"];
                var redirectUrl = $"{frontendUrl}/calendar?oauth=error&message={Uri.EscapeDataString(ex.Message)}";
                return Redirect(redirectUrl);
            }
        }



        // Add this method for token refresh (expires in 1 hour)
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest req)
        {
            try
            {
                var clientId = _config["GoogleOAuth:ClientId"];
                var clientSecret = _config["GoogleOAuth:ClientSecret"];
                var redirectUri = _config["GoogleOAuth:RedirectUri"];


                var flow = new GoogleAuthorizationCodeFlow(
                    new GoogleAuthorizationCodeFlow.Initializer
                    {
                        ClientSecrets = new ClientSecrets
                        {
                            ClientId = clientId,
                            ClientSecret = clientSecret
                        }
                    });

                var token = await flow.RefreshTokenAsync("user", req.RefreshToken,
                    CancellationToken.None);

                return Ok(new
                {
                    accessToken = token.AccessToken,
                    expiresIn = token.ExpiresInSeconds
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Token refresh failed: {ex.Message}");
            }
        }

        public class RefreshTokenRequest
        {
            public string RefreshToken { get; set; }
        }
        // STEP 3 — Fetch Google events (React sends accessToken)


        [HttpPost("events")]
        public async Task<IActionResult> GetGoogleEvents([FromBody] TokenRequest req)
        {

            if (string.IsNullOrEmpty(req.AccessToken))
            {
                return BadRequest("Access token is required");
            }

            try
            {
                var credential = GoogleCredential.FromAccessToken(req.AccessToken);

                var service = new CalendarService(new BaseClientService.Initializer
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "smart task"
                });

                // Test calendar access first
                try
                {
                    var calendar = await service.Calendars.Get("primary").ExecuteAsync();
                }
                catch (Exception calEx)
                {
                    return StatusCode(500, $"Calendar access failed: {calEx.Message}");
                }

                var request = service.Events.List("primary");
                request.TimeMin = DateTime.Now;
                request.MaxResults = 50;
                request.SingleEvents = true;
                request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;
                request.ShowDeleted = false;

                var events = await request.ExecuteAsync();


                if (events.Items == null || !events.Items.Any())
                {
                    return Ok(new List<object>()); // Return empty array instead of null
                }


                // ✅ FIX: Use correct date properties
                var result = events.Items
    .Where(e => e.Start != null && (e.Start.DateTime != null || e.Start.Date != null)) // Ensure we have a start date
    .Select(e => new
    {
        e.Id,
        e.Summary,
        e.Description,

        // Handle both date-time events and all-day events
        Start = e.Start.DateTime ?? (e.Start.Date != null ? DateTime.Parse(e.Start.Date) : (DateTime?)null),
        End = e.End.DateTime ?? (e.End.Date != null ? DateTime.Parse(e.End.Date) : (DateTime?)null),

        e.Location,
        IsAllDay = e.Start.DateTime == null && e.Start.Date != null // Flag for all-day events
    })
    .ToList();



                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching events: {ex.Message}");
            }
        }

    }

    public class TokenRequest
    {
        public string AccessToken { get; set; }
    }
}
