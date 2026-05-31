using System.Net.Http.Json;

namespace backend.Services.N8n;

public class N8nMatchingService : IN8nMatchingService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public N8nMatchingService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task TriggerMatchingAsync(Guid itemId, string type)
    {
        var webhookUrl = _config["N8n:WebhookUrl"];
        var secret = _config["N8n:Secret"];

        if (string.IsNullOrWhiteSpace(webhookUrl))
        {
            return;
        }

        var request = new HttpRequestMessage(HttpMethod.Post, webhookUrl);

        request.Headers.Add("x-n8n-secret", secret);

        request.Content = JsonContent.Create(new
        {
            itemId,
            type
        });

        try
        {
            await _httpClient.SendAsync(request);
        }
        catch
        {
            // Do not block item creation if n8n is down.
            // Later you can log this error.
        }
    }
}