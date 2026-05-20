namespace backend.Responses.Categories;

public record CategoryResponse(int Id, string Name , string? Description);

public record CategoryResponseName(string Name);
