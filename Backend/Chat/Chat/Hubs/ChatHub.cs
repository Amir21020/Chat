using Chat.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace Chat.Hubs;

public interface IChatClient
{
    Task ReceivedMessage(string userName,
        string message);
    Task UserListUpdated(List<string> users);
}

public sealed class ChatHub(IDistributedCache cache) : Hub<IChatClient>
{
    public async Task JoinChat(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId,
            connection.ChatRoom);

        var stringConnection = JsonSerializer.Serialize(connection);
        
        await cache.SetStringAsync(Context.ConnectionId, stringConnection);

        await AddUserToRoomAsync(connection.ChatRoom, connection.UserName);

        await Clients.Group(connection.ChatRoom)
            .ReceivedMessage("Admin", $"{connection.UserName} присоединился к чату");

        var users = await GetUsersInRoomAsync(connection.ChatRoom);
        await Clients.Group(connection.ChatRoom).UserListUpdated(users);
    }

    public async Task SendMessage(string message)
    {
        var connectionString = await cache.GetStringAsync(Context.ConnectionId);

        var connection = JsonSerializer.Deserialize<UserConnection>(connectionString);

        if (connection is not null)
        {
            await Clients.Group(connection.ChatRoom).ReceivedMessage(connection.UserName, message);
        }
    }

    public async Task<List<string>> GetUsersInRoomAsync(string chatRoom)
    {
        var usersJson = await cache.GetStringAsync($"room:{chatRoom}:users");
        if (usersJson is null) return [];
        return JsonSerializer.Deserialize<List<string>>(usersJson) ?? [];
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var connectionString = await cache.GetStringAsync(Context.ConnectionId);

        var connection = JsonSerializer.Deserialize<UserConnection>(connectionString);

        if (connection is not null)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, connection.ChatRoom);

            await RemoveUserFromRoomAsync(connection.ChatRoom, connection.UserName);

            await Clients.Group(connection.ChatRoom)
                .ReceivedMessage("Admin", $"{connection.UserName} вышел из чата");

            var users = await GetUsersInRoomAsync(connection.ChatRoom);
            await Clients.Group(connection.ChatRoom).UserListUpdated(users);

            await cache.RemoveAsync(Context.ConnectionId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    private async Task AddUserToRoomAsync(string room, string userName)
    {
        var usersJson = await cache.GetStringAsync($"room:{room}:users");
        var users = usersJson is not null
            ? JsonSerializer.Deserialize<List<string>>(usersJson) ?? []
            : [];

        if (!users.Contains(userName))
            users.Add(userName);

        await cache.SetStringAsync($"room:{room}:users", JsonSerializer.Serialize(users));
    }

    private async Task RemoveUserFromRoomAsync(string room, string userName)
    {
        var usersJson = await cache.GetStringAsync($"room:{room}:users");
        if (usersJson is null) return;

        var users = JsonSerializer.Deserialize<List<string>>(usersJson) ?? [];
        users.Remove(userName);
        await cache.SetStringAsync($"room:{room}:users", JsonSerializer.Serialize(users));
    }
}
