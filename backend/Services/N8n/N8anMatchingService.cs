using System.Net.Http.Json;

namespace backend.Services.N8n;

public class N8nMatchingService : IN8nMatchingService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly ILogger<N8nMatchingService> _logger;

    public N8nMatchingService(
        HttpClient httpClient,
        IConfiguration config,
        ILogger<N8nMatchingService> logger
    )
    {
        _httpClient = httpClient;
        _config = config;
        _logger = logger;
    }

    public async Task TriggerMatchingAsync(Guid itemId, string type)
    {
        var webhookUrl = _config["N8n:WebhookUrl"];
        var secret = _config["N8n:Secret"];

        if (string.IsNullOrWhiteSpace(webhookUrl))
        {
            _logger.LogWarning("Skipping n8n matching trigger because N8n:WebhookUrl is missing.");
            return;
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, webhookUrl);

        if (!string.IsNullOrWhiteSpace(secret))
        {
            request.Headers.Add("x-n8n-secret", secret);
        }

        request.Content = JsonContent.Create(new
        {
            itemId,
            type
        });

        try
        {
            using var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                _logger.LogWarning(
                    "n8n matching trigger failed with status {StatusCode}: {ResponseBody}",
                    (int)response.StatusCode,
                    responseBody
                );
            }
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unable to trigger n8n matching workflow.");
        }
    }
}
