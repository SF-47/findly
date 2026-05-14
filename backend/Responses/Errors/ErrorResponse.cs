namespace backend.Responses.Errors;

public record ErrorResponse(string ErrorMessage, List<string> errors);
