/*namespace smart_task_manager.Models
{
    public class Notification
    { public int id { get; set; }
        public string title { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; }

        //Link to User 
        public string UserId { get; set; } //ID stored in DB
        public User User { get; set; }//actual task object you can use in your code
        //Link to task 
        public int? TaskId { get; set; }
        public TaskItem Task { get; set; }
        //Link to projects 
        public int? ProjectId { get; set; }
        public Project Project { get; set; }
    }
}
*/