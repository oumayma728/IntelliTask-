using Microsoft.AspNetCore.Identity;

namespace smart_task_manager.Models
{   public enum UserRole
    {
        Manager,
        User
    }
    public class User:IdentityUser
    {
        public UserRole Role { get; set; } =  UserRole.User;
        public DateTime CreatedAt {  get; set; }
        public List<Project> Project { get; set; } = new();
        public string Mode { get; set; } = "personal";

    }

}
