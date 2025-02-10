import { WaitingRoom } from "./components/WaitingRoom"
import {HubConnectionBuilder} from "@microsoft/signalr"
function App() {
  const joinChat = async (userName, chatRoom) => {
    var connection = new HubConnectionBuilder()
    .withUrl("https://localhost:7086/chat")
    .withAutomaticReconnect()
    .build();

    try{
      await connection.start()
      await connection.invoke("JoinChat", {userName, chatRoom} );
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gry-100">
      <WaitingRoom joinChat={joinChat} />
    </div>
  )
}

export default App
