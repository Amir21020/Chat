import { useState } from "react";
import { WaitingRoom } from "./components/WaitingRoom"
import {HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr"
import { Chat } from "./components/Chat";

function App() {
  const [connection, setConnection] = useState(null);
  const [chatRoom, setChatRoom] = useState("")
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [connectionStatus, setConnectionStatus] = useState("idle")
  const [error, setError] = useState("")

  const joinChat = async (userName, chatRoom) => {
    const connection = new HubConnectionBuilder()
    .withUrl("/chat")
    .withAutomaticReconnect()
    .build();

    connection.on("ReceivedMessage",
      (userName, message) => {
        setMessages((messages) => [...messages, {userName, message, timestamp: new Date().toLocaleTimeString()}])
      }
    )

    connection.on("UserListUpdated", (users) => {
      setUsers(users)
    })

    connection.onreconnecting(() => {
      setConnectionStatus("reconnecting")
    })

    connection.onreconnected(() => {
      setConnectionStatus("connected")
    })

    connection.onclose(() => {
      setConnectionStatus("disconnected")
      setConnection(null)
      setMessages([])
      setUsers([])
    })

    try{
      setConnectionStatus("connecting")
      await connection.start()
      await connection.invoke("JoinChat", {userName, chatRoom} );

      setConnection(connection)
      setChatRoom(chatRoom)
      setConnectionStatus("connected")
      setError("")
    }
    catch(error){
      setConnectionStatus("idle")
      setError(error.message || "Ошибка подключения")
    }
  }

  const sendMessage = (message) => {
    if (connection?.state === HubConnectionState.Connected) {
      connection.invoke("SendMessage", message)
    }
  }

  const closeChat = async () => {
    await connection.stop();
    setConnection(null)
    setMessages([])
    setUsers([])
    setConnectionStatus("idle")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {connection ? (<Chat messages={messages} chatRoom={chatRoom} users={users} connectionStatus={connectionStatus} closeChat={closeChat} sendMessage={sendMessage} />)
       : (
       <WaitingRoom joinChat={joinChat} error={error} />
       )}
    </div>
  )
}

export default App
