namespace backend.Services.N8n;

//  SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public interface IN8nMatchingService
{
    Task TriggerMatchingAsync(Guid itemId, string type);
}