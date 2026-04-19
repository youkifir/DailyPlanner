using Daily_Planning.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DailyPlanner.Models.ModelsDTO
{
    public class TaskRequestDTO
    {
        [Required]
        [MinLength(3)]
        [MaxLength(255)]
        public string Title { get; set; }
        [MaxLength(2048)]
        public string? Description { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        [Required]
        public Priority Priority { get; set; }
    }
}
