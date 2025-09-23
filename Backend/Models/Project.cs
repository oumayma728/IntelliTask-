namespace smart_task_manager.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DueDate { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TaskItem> Task { get; set; } = new();

        public string? UserId { get; set; }         // ← Change from int to string
        public User? User { get; set; }
    }
}
