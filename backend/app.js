const express = require('express')
const { db, mongo } = require('./mongo')   //gets mongodb db instance
const cors = require('cors')
const socketIo = require('socket.io')
const http = require('http')
const email = require('@emailjs/browser')

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
const {response}=require('express')
app.use("/api/reservation", reservation);

// socket initialization for live notifications
const server = http.createServer(app);
const connectedUsers = [];
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on('connection', (socket) => {
    console.log("client connected: ", socket.id);

    socket.on('sendId', (response) => {
        console.log(`Got this response: ${response}`);
        socket.join(`${response}`);
        connectedUsers.push(response);
    })

    socket.on('emitBruh', (response) => {
        console.log(`${response['name']} wants to send a message to ${response['recipient']}`);

        if (connectedUsers && connectedUsers.find((e) => e === response['recipient'])) {
            // user is online; give live notification
            io.to(`${response['recipient']}`).emit('emitAnotherUser', 'Someone pinged u!');
            socket.emit('emitBack', 'success');
        } else {
            // user is not online; give email notification instead
            socket.emit('emitBack', 'kay2@kay2');
        }
    })
    
    // todo: remove the client that logs out from the connectedUsers
    socket.on('sendRemoveId', (response) => {
        // remove the email
    })

    socket.on('disconnect', () => {
        socket.disconnect();
    })
})


server.listen(8888, () => {
    console.log("server is listening on port 8888...")
})
