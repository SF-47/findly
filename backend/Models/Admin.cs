namespace backend.Models;

public class Admin
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "UniversityAdmin";

    public Guid? UniversityId { get; set; }

    public University? University { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
