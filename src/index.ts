import { WebSocketServer,WebSocket } from "ws";
import ApiResponse from "./utility/ApiResponse";

const wss = new WebSocketServer({
    port:8080
});

let userCount = 0;

// interface User {
//     socket:WebSocket,
//     roomName:string
// }
interface RoomInfo{
    roomName:string,
    users: WebSocket[]
}

// key would be room key and value would be User interface

let allSockets  = new Map<string,RoomInfo>();



const createChatRoom = (name:string,s:WebSocket) =>{
    s.on('error', (error) => {
        console.error("WebSocket error:", error.message);
      });
    const key = random(6);
    
    allSockets.set(
        key,{
            roomName: name,
            users: [s]
        } 
    )
    const res = new ApiResponse(1000,{roomKey:key,roomName:name},"Room created success",true,"create")

    s.send(JSON.stringify(res));


}

const joinRoom =(key: string,s:WebSocket)=>{
    s.on('error', (error) => {
        console.error("WebSocket error:", error.message);
      });

      const room = allSockets.get(key);
      if(!room){
        const res = new ApiResponse(404,{},"Invalid key",false,"null");
        s.send(JSON.stringify(res));
        return;
      }
      room?.users.push(s);

      const res = new ApiResponse(1000,{},"Room joined success",true,"join")

     s.send(JSON.stringify(res));

}

const sendMessage = (msg:string, s:WebSocket) =>{
    s.on('error', (error) => {
        console.error("WebSocket error:", error.message);
      });

      let messageReceivers = null;
      for(const [k,v] of allSockets){
        const roomUsers = v.users;
        if(roomUsers.find((user)=> user === s)  ){
            messageReceivers = roomUsers
            break;
        }
      }
      if(!messageReceivers){
        console.error("No room to join");
        return;
      }
      messageReceivers?.forEach((receiver)=>{
        const res = new ApiResponse(1000,msg,"Message sent success",true,"chat")

        s.send(JSON.stringify(res));
      })
}


wss.on("connection",(socket)=>{

    

    socket.on("message",(message)=>{
        try{
            const jsonMessage = JSON.parse(message.toString());
            const messageType = jsonMessage?.type;

            switch(messageType){
                case "create":{
                    createChatRoom(jsonMessage?.payload?.roomName,socket)
                    break;
                }
                case "join":{
                    joinRoom(jsonMessage?.payload?.roomKey,socket)
                    break;
                }
                case "chat":{
                    sendMessage(jsonMessage?.payload?.message,socket);
                    break;
                }
            }

        }catch(e){
            console.error("Invalid JSON received:", e);
            socket.send(JSON.stringify(new ApiResponse(400, {}, "Invalid message format", false,"null")));
        }
       
    })
    
})