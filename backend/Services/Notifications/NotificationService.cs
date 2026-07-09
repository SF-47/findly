using System.Net.Http.Json;

namespace backend.Services.Notifications;

public class NotificationService : INotificationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(HttpClient httpClient, ILogger<NotificationService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task SendPushNotificationAsync(string pushToken, string title, string body, object? data = null)
    {
        if (string.IsNullOrWhiteSpace(pushToken)) return;

        try
        {
            var payload = new { to = pushToken, sound = "default", title, body, data };
            var response = await _httpClient.PostAsJsonAsync("https://exp.host/--/api/v2/push/send", payload);

            if (!response.IsSuccessStatusCode)
            {
                var errorMsg = await response.Content.ReadAsStringAsync();
                _logger.LogError($"Failed to send push notification: {errorMsg}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while sending push notification.");
        }
    }
}
