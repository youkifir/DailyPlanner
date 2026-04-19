using Daily_Planning.Services;
using Microsoft.AspNetCore.Mvc;
using Daily_Planning.Models.ModelsDTO;

namespace Daily_Planning.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            if (ModelState.IsValid)
            {
                if (await _authService.Register(registerDTO.Email, registerDTO.Name, registerDTO.Role, registerDTO.Password))
                {
                    return Ok();
                }
                else
                {
                    return Conflict();
                }
            }
            else
            {
                return BadRequest();
            }
        }
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (ModelState.IsValid)
            {
                string? token = await _authService.Login(loginDTO.Email, loginDTO.Password);
                if (token == null)
                {
                    return Unauthorized();
                }
                else
                {
                    return Ok(new { token });
                }
            }
            else
            {
                return BadRequest();
            }
        }

    }
}
