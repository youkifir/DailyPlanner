using Daily_Planning.Models;
using Microsoft.EntityFrameworkCore;

namespace Daily_Planning.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<TaskItem> Tasks {  get; set; }
        public DbSet<User> Users { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) 
            : base(options) { }
    }
}
