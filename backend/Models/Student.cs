namespace backend.Models;

public class Student
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string UniversityId { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string UniversityCardImageUrl { get; set; } = string.Empty;

    public bool IsVerified { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
