const express = require('express')
const { db, mongo } = require('./mongo')   //gets mongodb db instance
const cors = require('cors')
const socketIo = require('socket.io')
const http = require('http')

const app = express();

//middleware
app.use(cors());

app.use(express.urlencoded({ extended: false, limit: '50mb' })) //parse form data

app.use(express.json({ limit: '50mb' })) // parse json

//item related processing
const item = require("./item").router;
app.use("/api/item", item);

//request related processing
const request = require("./request").router;
app.use("/api/request", request)


//user-related processing
const user = require("./user")
app.use("/api/user", user)

//reservation-related processing
const reservation = require('./reservation');
app.use("/api/reservation", reservation);

// socket initialization for live notifications
const server = http.createServer(app);
var connectedUsers = [];
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on('connection', (socket) => {
    console.log("client connected: ", socket.id)
    socket.on('sendId', (response) => {
        console.log("making join for :", response)
        socket.join(`${response}`);
        connectedUsers.push(response);
    })

    socket.on('emitBruh', (response) => {
        console.log(`${response['name']} want to send a message to ${response['recipient']}`);
        if (connectedUsers && connectedUsers.find((e) => e === response['recipient'])) {
            // user is online; give live notification
            if (response['msg'] === 'approved') {
                io.to(`${response['recipient']}`).emit('emitAnotherUser', {isApproved: true,  msg: `${response['name']} has ${response['msg']} your request!`, itemId: response['itemId']});
                console.log(connectedUsers);
                console.log("sent notification!")
            } else {
                io.to(`${response['recipient']}`).emit('emitAnotherUser', {isApproved: false,  msg: `${response['name']} has ${response['msg']} your request!`});
            }
            socket.emit('emitBack', 'success');
        } else {
            // user is not online; give email notification instead
            socket.emit('emitBack', response['recipient']);
        }
    })
    
    socket.on('leaveChannel', (response) => {
        // remove the email
        const newConnectedUsers = connectedUsers.filter((e) => e != response)
        console.log(newConnectedUsers);
        connectedUsers = newConnectedUsers;
    })

    socket.on('disconnect', () => {
        socket.disconnect();
    })
})


server.listen(8888, () => {
    console.log("server is listening on port 8888...")
})
