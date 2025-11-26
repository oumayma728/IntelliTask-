public class ChangePasswordDto
{
    public string UserId { get; set; }       // The user changing the password
    public string CurrentPassword { get; set; } // Optional if using reset token
    public string NewPassword { get; set; }

}