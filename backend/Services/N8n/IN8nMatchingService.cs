namespace backend.Services.N8n;

public interface IN8nMatchingService
{
    Task TriggerMatchingAsync(Guid itemId, string type);
}