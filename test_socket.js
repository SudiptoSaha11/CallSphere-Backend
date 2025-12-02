const io = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
    socket.emit("join room", "test-room");
});

socket.on("connect_error", (err) => {
    console.log("Connection error:", err.message);
});

socket.on("room full", () => {
    console.log("Room is full");
});

socket.on("all users", (users) => {
    console.log("Joined room. Users in room:", users);
    socket.disconnect();
});

setTimeout(() => {
    if (!socket.connected) {
        console.log("Timeout: Could not connect to server.");
        process.exit(1);
    }
}, 5000);
