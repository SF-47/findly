namespace backend.Services.Notifications;

public interface INotificationService
{
    Task SendPushNotificationAsync(string pushToken, string title, string body, object? data = null);
}
