const io = require("socket.io")(8900, {
    // cors is enabled to allow commuication between the frontend and the backend
    cors: {
        // the react app will start on port 3000
        origin: "http://localhost:3000"
    }
})

// initialize an empty array of users
let users = []

// if there is no user with the corresponding
// userId inside users array, push the user into users
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId })
}

// remove user from array
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

// get user from array
const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

// listens for new connections
io.on("connection", (socket) => {
    console.log("a user connected")
    // receive userId and socketId from frontend
    // add the user who connected to the users array
    // send the info to the other users
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })
    
    // send message to user
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId)
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text
        })
    })

    // remove user who disconnected from the users array
    // send the info to the other users
    socket.on("disconnect", () => {
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})
