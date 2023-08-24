const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: "*"
}));

const io = new Server(server, {
    cors: {
        origin: "https://bayezid-chat-app.web.app",
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    console.log(`User Connected ${socket.id}`);

    socket.on("disconnect", () => {
        console.log("User Disconnect", socket.id)
    });

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
});

app.get("/", (req,res) =>{
    res.send("Chat App is running")
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log('Chat app server is running');
});
