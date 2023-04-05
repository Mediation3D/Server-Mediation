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
const http = require('http');
const path = require('path');
const { jwt: { AccessToken } } = require('twilio');

// some hard coded user details
const users = [
    {identity: "user1", role: "user"},
    {identity: "user2", role: "user"},
    {identity: "user3", role: "user"},
    {identity: "user4", role: "user"},
    {identity: "user5", role: "user"},
    {identity: "admin", role: "host"}
]

const VideoGrant = AccessToken.VideoGrant;

// Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
const MAX_ALLOWED_SESSION_DURATION = 14400;

// Create Express webapp.
const app = express();

app.use(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
});

app.get('/', function(request, response) {
    response.status(200).json({ status: "success", body: "App is running"})
})

/**
 * Generate an Access Token for a chat application user provided via the url
 */
app.get('/token', function(request, response) {
    console.log('test', request.query.identity)
    var identity = request.query.identity;

    if (!identity) {
        return response.status(400).send({
            body: "An identity is needed"
        })
    }

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created.
    var token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { identity: identity }
    );

    // Assign the generated identity to the token.
    token.identity = identity;

    // Grant the access token Twilio Video capabilities.
    var grant = new VideoGrant();
    token.addGrant(grant);

    // Serialize the token to a JWT string and include it in a JSON response.
    response.send({
        identity: identity,
        token: token.toJwt()
    });
});

app.get('/getUser', function(request, response) {
    const identity = request.query.identity

    if (!identity) {
        return response.status(400).send({
            status: "error",
            body: "identity is required..."
        })
    }

    const user = users.find(user => user.identity === identity)

    if (!user) {
        return response.status(400).send({
            status: "error",
            body: "identity not found"
        })
    }

    return response.status(200).send({
        status: "success",
        data: user
    })
});

// Create http server and run it.
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Express server running on *:' + port);
});