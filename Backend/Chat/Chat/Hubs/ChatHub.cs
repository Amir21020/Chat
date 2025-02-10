using Chat.Models;
using Microsoft.AspNetCore.SignalR;

namespace Chat.Hubs;

public interface IChatClient
{
    public Task ReceivedMessage(string userName,
        string message);
}

public sealed class ChatHub : Hub<IChatClient>
{
    public async Task JoinChat(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId,
            connection.ChatRoom);
        await Clients.Group(connection.ChatRoom)
            .ReceivedMessage("Admin", $"{connection.UserName} присоединился к чату");
    }
}
