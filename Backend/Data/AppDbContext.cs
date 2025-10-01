using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using smart_task_manager.Models;

namespace smart_task_manager.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base (options) { }

        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Notification> Notifications { get; set; }
    }

}
