/*using smart_task_manager.Data;
using smart_task_manager.Services;
using smart_task_manager.Models;
using Microsoft.EntityFrameworkCore;


//BackgroundService is a special class in ASP.NET Core for running code in the background continuously,
public class DeadlineCheckerService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;// allows us to get services like DbContext and notification service
    public DeadlineCheckerService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      // Repeat until the app stops
        while (!stoppingToken.IsCancellationRequested)
        {//Create a temporary container for scoped services.
         //Inside this container, you can safely get services like AppDbContext and INotificationService.
            using (var scope = _serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                var now = DateTime.UtcNow; // current time
                // Find tasks due in the next 24 hours
                var upcomingTasks = await db.Tasks
                    .Where(t => t.DueDate != null &&
                                t.DueDate > now &&
                                t.DueDate <= now.AddDays(1)) // due in next 24h
                    .ToListAsync();
                // For each upcoming task, create a notification

                foreach (var task in upcomingTasks)
                {
                    await notificationService.CreateNotification(new Notification
                    {
                        UserId = task.UserId,
                        Message = $"Reminder: Task '{task.Title}' is due soon!",
                        TaskId = task.Id
                    });
                }
            }

            // wait 1 hour before checking again
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);// wait 1 hour before checking again
        }
    }
}*/