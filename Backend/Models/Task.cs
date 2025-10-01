namespace smart_task_manager.Models
{
    public class TaskItem
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public DateTime? DueDate { get; set; }
        public string ProjectName{ get; set; }
        public string Description { get; set; }

        public string? UserId { get; set; }
        public string Status { get; set; }

        public List<SubTask> SubTasks { get; set; } = new();
        public Project? Project { get; set; } // navigation property

    }
}
