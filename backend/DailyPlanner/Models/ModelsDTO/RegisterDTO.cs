namespace Daily_Planning.Models.ModelsDTO
{
    public class RegisterDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; } = "user";
        public string Password { get; set; }
    }
}
