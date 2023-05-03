'use strict';

/**
 * Load Twilio configuration from .env config file - the following environment
 * variables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 */
require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const { jwt: { AccessToken } } = require('twilio');
const server = http.createServer(app);
const { Server } = require("socket.io");

const roomController = require('../controllers/roomController');
const userController = require('../controllers/userController');

const VideoGrant = AccessToken.VideoGrant;
// Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
const MAX_ALLOWED_SESSION_DURATION = 14400;
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 3000;

const socketsArray = [];

app.use(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
});

app.get('/token', function(request, response) {
    var identity = request.query.identity;

    if (!identity) {
        return response.status(400).send({
            body: "An identity is needed"
        })
    }

    var token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { identity: identity }
    );

    token.identity = identity;

    var grant = new VideoGrant();
    token.addGrant(grant);

    response.send({
        identity: identity,
        token: token.toJwt()
    });
});

server.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});

io.on("connection", socket => {
    console.log("Client socket connected !");

    socket.on("@authenticate", ({ username }, callback) => {
        userController.login({ username }, callback);
        socketsArray.push({ socket, username });
    });

    socket.on('@getRooms', roomController.getRooms);
    socket.on('@createRoom', roomController.createRoom);
    socket.on('@joinRoom', roomController.joinRoom);
    socket.on('@leaveRoom', roomController.leaveRoom);
    socket.on('@getUsers', userController.getUsers);

    socket.on("disconnect", (reason) => {
        console.log('DISCONNECT');

        // const index = socketsArray.findIndex(object => object.socket.id === socket.id);
        // if (index !== -1) {
        //     socketsArray.splice(index, 1);
        // }
    });
})