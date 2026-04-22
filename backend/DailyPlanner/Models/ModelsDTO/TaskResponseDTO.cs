using Daily_Planning.Models;
using System.ComponentModel.DataAnnotations;

namespace DailyPlanner.Models.ModelsDTO
{
    public class TaskResponseDTO
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
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
