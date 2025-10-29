namespace smart_task_manager.DTOs
{
    public class CreateEventDto
    {
        public string Title { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Description { get; set; }
       
    }

}
