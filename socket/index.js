import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});


let onlineUsers = []

const addNewUser = (username,socketId)=>{
  !onlineUsers.some((user)=>{user.username === username}) && onlineUsers.push({username,socketId}) //add user if not contained in online users list

}

const removeUser = (socketId)=>{
onlineUsers = onlineUsers.filter((user)=>{user.socketId !==socketId})
}

const getUser = (username)=>{
return onlineUsers.find((user)=>user.username === username)
}
io.on("connection", (socket) => {
  console.log('someone has just connected');
  // io.emit("firstEvent","Hello this is test") // send to all users
  // io.to("dkdkdkdkd").emit("firstEvent","Hello this is test")
     socket.on("newUser",(username)=>{
      addNewUser(username,socket.id)
     })

     socket.on("sendNotification",({senderName,receiverName,type})=>{
      const receiver = getUser(receiverName)
      io.to(receiver.socketId).emit("getNotification",{
        senderName,type
      })
     })

  socket.on('disconnect',() =>{
    console.log('someone has left')
    removeUser(socket.id) //not an event, nothing is taken from client
  })

});


io.listen(5000);
