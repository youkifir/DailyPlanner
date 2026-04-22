using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Daily_Planning.Models
{
    public enum Priority
    {
        Low,
        Middle,
        High
    }
    public class TaskItem 
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [MaxLength(255)]
        public string Title { get; set; }
        [MaxLength(2048)]
        public string? Description { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        [Required]
        public Priority Priority { get; set; }
        [Required]
        public bool IsCompleted { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public int UserID { get; set; }
        [Required]
        public User User { get; set; }
    }
}
