namespace smart_task_manager.Models
{
    public class SubTask
    { public int Id {  get; set; }
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
        public string Status { get; set; }

        public int TaskId { get; set; }
        public TaskItem Task { get; set; }
    }
}
