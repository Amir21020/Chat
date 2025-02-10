using Chat.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace Chat.Hubs;

public interface IChatClient
{
    public Task ReceivedMessage(string userName,
        string message);
}

public sealed class ChatHub(IDistributedCache cache) : Hub<IChatClient>
{
    public async Task JoinChat(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId,
            connection.ChatRoom);

        var stringConnection = JsonSerializer.Serialize(connection);
        
        await cache.SetStringAsync(Context.ConnectionId, stringConnection);

        await Clients.Group(connection.ChatRoom)
            .ReceivedMessage("Admin", $"{connection.UserName} присоединился к чату");
    }

    public async Task SendMessage(string message)
    {
        var connectionString = await cache.GetStringAsync(Context.ConnectionId);

        var connection = JsonSerializer.Deserialize<UserConnection>(connectionString);

        if(connection is not null)
        {
            await Clients.Group(connection.ChatRoom).ReceivedMessage(connection.UserName, message);
        }

    }

    public async override Task OnDisconnectedAsync(Exception? exception)
    {
        var connectionString = await cache.GetStringAsync(Context.ConnectionId);

        var connection = JsonSerializer.Deserialize<UserConnection>(connectionString);

        if(connection is not null )
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, connection.ChatRoom);
            await Clients.Group(connection.ChatRoom).ReceivedMessage("Admin", $"{connection.UserName} вышел из чата");
            await cache.RemoveAsync(Context.ConnectionId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}
