using Azure;
using Daily_Planning.Models;
using Daily_Planning.Services;
using DailyPlanner.Models.ModelsDTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Daily_Planning.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }
        private int _userId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tasks = await _taskService.GetAll(_userId);
            return Ok(tasks);
        }
        [HttpGet]
        [Route("task/{taskId}")]
        public async Task<IActionResult> Get(int taskId)
        {
            var task = await _taskService.Get(taskId, _userId);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }
        [HttpDelete]
        [Route("task/{taskId}")]
        public async Task<IActionResult> Delete(int taskId)
        {
            bool deleted = await _taskService.Delete(taskId, _userId);
            if (deleted)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] TaskRequestDTO taskDTO)
        {
            if (ModelState.IsValid)
            {
                var taskItem = new TaskItem
                {
                    Title = taskDTO.Title,
                    Description = taskDTO.Description,
                    DueDate = taskDTO.DueDate,
                    Priority = taskDTO.Priority,
                    IsCompleted = false,
                    CreatedAt = DateTime.UtcNow,
                    UserID = _userId
                };
                var task = await _taskService.Create(taskItem);
                return Created();
            }
            else
            {
                return BadRequest();
            }
        }
        [HttpPut("task/edit/{taskId}")]
        public async Task<IActionResult> Update(int taskId, [FromBody] TaskRequestDTO taskDTO)
        {
            if (ModelState.IsValid)
            {
                var taskToUpdate = await _taskService.Get(taskId, _userId);
                if (taskToUpdate != null)
                {
                    var updatedTask = await _taskService.Update(taskId, taskDTO, _userId);
                    return Ok(updatedTask);
                }

                return NotFound();
            }
            else
            {
                return BadRequest();
            }
        }
        [HttpPatch("task/{taskId}/complete")]
        public async Task<IActionResult> Complete(int taskId)
        {
            bool result = await _taskService.Complete(taskId, _userId);
            if(result) return Ok();
            return NotFound();
        }
    }
}
