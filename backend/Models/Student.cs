namespace backend.Models;

public class Student
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public Guid UniversityId { get; set; }

    public string UniversityStudentId { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string UniversityCardImageUrl { get; set; } = string.Empty;

    public bool IsVerified { get; set; } = false;

    public string? ExpoPushToken { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public University? University { get; set; }
}
