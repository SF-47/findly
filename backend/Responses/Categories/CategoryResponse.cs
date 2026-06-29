namespace backend.Responses.Categories;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public record CategoryResponse(int Id, string Name , string? Description);

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public record CategoryResponseName(string Name);
