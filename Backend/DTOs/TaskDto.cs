namespace smart_task_manager.DTOs
{
    public class CreateTaskDto
    {
        public string Title { get; set; }

        public DateTime? DueDate { get; set; }
        public string ProjectName { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }

}
