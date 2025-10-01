using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace smart_task_manager.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            // ⚠️ Use the same connection string you have in appsettings.json
            optionsBuilder.UseSqlServer(
                "Server=(localdb)\\MSSQLLocalDB;Database=TaskManagerDB;Trusted_Connection=True;TrustServerCertificate=True;");

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
