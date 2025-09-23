namespace smart_task_manager.DTOs
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;  // JWT token
        public string Mode { get; set; } = "personal";     // personal or team
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
    }
}
