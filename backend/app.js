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
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on('connection', (socket) => {
    console.log("client connected: ", socket.id);
    socket.join('room1');

    socket.on('emitBruh', (response) => {
        console.log(`got a bruh! ${response['name']}`);

        socket.emit('emitBack', 'Thank you for response!');
        io.to('room1').emit('emitAnotherUser', 'Someone pinged u!')
    })
    
    socket.on('disconnect', () => {
        socket.disconnect();
    })
})


server.listen(8888, () => {
    console.log("server is listening on port 8888...")
})
