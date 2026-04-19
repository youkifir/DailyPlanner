using Daily_Planning.Data;
using Daily_Planning.Models;
using DailyPlanner.Models.ModelsDTO;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Daily_Planning.Services
{
    public interface ITaskService
    {
        public Task<TaskItem> Create(TaskItem item);
        public Task<TaskResponseDTO?> Get(int taskId, int userId);
        public Task<List<TaskResponseDTO>> GetAll(int userId);
        public Task<bool> Update(int id, TaskRequestDTO item, int userId);
        public Task<bool> Delete(int id, int userId);
        public Task<bool> Complete(int taskId, int userId);
    }
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _db;
        public TaskService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<bool> Complete(int taskId, int userId)
        {
            var task = await _db.Tasks.FindAsync(taskId);
            if (task != null && task.UserID == userId)
            {
                task.IsCompleted = !task.IsCompleted;
                await _db.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<TaskItem> Create(TaskItem item)
        {
            await _db.Tasks.AddAsync(item);
            await _db.SaveChangesAsync();
            return item;
        }

        public async Task<bool> Delete(int id, int userId)
        {
            var task = await _db.Tasks.FindAsync(id);
            if (task != null && task.UserID == userId)
            {
                _db.Tasks.Remove(task);
                await _db.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<TaskResponseDTO?> Get(int taskId, int userId)
        {
            var task = await _db.Tasks
                .Where(t => t.UserID == userId && t.Id == taskId)
                .FirstOrDefaultAsync();

            if (task != null)
            {
                var taskToResponse = new TaskResponseDTO
                {
                    Id = taskId,
                    Title = task.Title,
                    Description = task.Description,
                    DueDate = task.DueDate,
                    Priority = task.Priority,
                    IsCompleted = task.IsCompleted,
                    CreatedAt = task.CreatedAt
                };
                return taskToResponse;
            }
            return null;
        }

        public async Task<List<TaskResponseDTO>> GetAll(int userId)
        {
            var tasks = await _db.Tasks
                .Where(u => u.UserID == userId)
                .ToListAsync();
            var tasksToResponse = tasks.Select(task => new TaskResponseDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                DueDate = task.DueDate,
                Priority = task.Priority,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt
            }).ToList();
            return tasksToResponse;
        }

        public async Task<bool> Update(int id, TaskRequestDTO item, int userId)
        {
            var taskToUpdate = await _db.Tasks.FindAsync(id);
            if (taskToUpdate != null && taskToUpdate.UserID == userId)
            {
                taskToUpdate.Title = item.Title;
                taskToUpdate.Description = item.Description;
                taskToUpdate.DueDate = item.DueDate;
                taskToUpdate.Priority = item.Priority;
                await _db.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
