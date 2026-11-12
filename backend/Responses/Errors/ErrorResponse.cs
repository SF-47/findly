namespace backend.Responses.Errors;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public record ErrorResponse(string ErrorMessage, List<string> errors);
