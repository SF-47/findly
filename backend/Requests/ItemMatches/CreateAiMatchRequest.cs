namespace backend.Requests.ItemMatches;
//for saving AI matches
// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public record CreateAiMatchRequest(
    Guid LostItemId,
    Guid FoundItemId,
    int MatchPercentage,
    string ConfidenceLevel,
    string ReasoningSummary
);