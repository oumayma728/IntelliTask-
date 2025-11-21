namespace smart_task_manager.Models
{
    public enum ProjectStatus
    {
        Open,
        Complete,
        Uncomplete
    }
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TaskItem> Task { get; set; } = new();
        public string? UserId { get; set; }
        public User? User { get; set; }
    }
}
