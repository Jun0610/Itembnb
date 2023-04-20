const express = require('express')
const { db, mongo } = require('./mongo') //gets mongodb db instance
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

//review-related processing
const review = require('./review')
app.use("/api/review", review)

//user-related processing
const user = require("./user")
app.use("/api/user", user)

//reservation-related processing
const reservation = require('./reservation');
app.use("/api/reservation", reservation);

const server = http.createServer(app);
var connectedUsers = [];
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on('connection', (socket) => {
    socket.on('sendId', (response) => {
        socket.join(`${response}`);
        if (!connectedUsers.includes(response)) connectedUsers.push(response)
    })

    // notify user an item has been added to their request
    socket.on('emitRequestAddItem', (response) => {
        // send notification to borrower
        if (connectedUsers && connectedUsers.find((e) => e === response['recipient'])) {
            // user is online; give live notification
            io.to(`${response['recipient']}`).emit('emitBack', { toRequester: true, msg: `${response['name']} has recommended new item(s) for your request: ${response['request_obj']['name']}!`, url: `/display-request-post/${response['request_obj']['_id']}` });
            socket.emit('emitBackR', 'success');
        }
    })

    socket.on('emitMsg', (response) => {
        if (response['type'] === 'toBorrower') {
            // send notification to borrower
            if (connectedUsers && connectedUsers.find((e) => e === response['recipient'])) {
                // user is online; give live notification
                if (response['msg'] === 'approved') {
                    io.to(`${response['recipient']}`).emit('emitBack', { toBorrower: true, isApproved: true, msg: `${response['name']} has ${response['msg']} your request!`, url: `/item-status` });
                } else {
                    io.to(`${response['recipient']}`).emit('emitBack', { toBorrower: true, isApproved: false, msg: `${response['name']} has ${response['msg']} your request!` });
                }
                socket.emit('emitBackL', 'success');
            } else {
                // user is not online; give email notification instead
                socket.emit('emitBackL', response['recipient']);
            }
        } else {
            // send notification to lender
            if (connectedUsers && connectedUsers.find((e) => e === response['owner'])) {
                // user is online; give live notification
                console.log("lender is online");
                io.to(`${response['owner']}`).emit('emitBack', { toBorrower: false, msg: `${response['borrower']} has requested a reservation for your item!`, url: `/display-item-post/${response['itemId']}` });
                socket.emit('emitBackB', 'success');
            } else {
                // user is not online; give email notification instead
                socket.emit('emitBackB', response['owner']);
            }
        }
    })

    socket.on('emitToBorrower', (response) => {
        if (connectedUsers && connectedUsers.find((e) => e === response['recipient'])) {
            // user is online; give live notification
            if (response['msg'] === 'approved') {
                io.to(`${response['recipient']}`).emit('emitBack', { toBorrower: true, isApproved: true, msg: `${response['name']} has ${response['msg']} your request!`, url: `/selected-item-post/${response['itemId']}` });
            } else {
                io.to(`${response['recipient']}`).emit('emitBack', { toBorrower: true, isApproved: false, msg: `${response['name']} has ${response['msg']} your request!` });
            }
            socket.emit('emitBackL', 'success');
        } else {
            // user is not online; give email notification instead
            socket.emit('emitBackL', response['recipient']);
        }
    })

    socket.on('emitToLender', (response) => {
        if (connectedUsers && connectedUsers.find((e) => e === response['owner'])) {
            // user is online; give live notification
            io.to(`${response['owner']}`).emit('emitBack', { toBorrower: false, msg: `${response['borrower']} has requested a reservation for your item!`, url: `/display-item-post/${response['itemId']}` });
            socket.emit('emitBackB', 'success');
        } else {
            // user is not online; give email notification instead
            socket.emit('emitBackB', response['owner']);
        }
    });

    socket.on('leaveChannel', (response) => {
        // remove the email
        const newConnectedUsers = connectedUsers.filter((e) => e != response)
        connectedUsers = newConnectedUsers;
    })

    socket.on('disconnect', () => {
        socket.disconnect();
    })
})

server.listen(8888, () => {
    console.log("server is listening on port 8888...")
})