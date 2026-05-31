namespace backend.Requests.ItemMatches;

public record CreateAiMatchRequest(
    Guid LostItemId,
    Guid FoundItemId,
    int MatchPercentage,
    string ConfidenceLevel,
    string ReasoningSummary
);