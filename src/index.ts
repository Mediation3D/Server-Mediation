/**
 * Load Twilio configuration from .env config file - the following environment
 * variables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 */
require('dotenv').config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import RoomController from './controllers/RoomController';
import UserController from './controllers/UserController';
import { Socket } from './types/business';
import SocketService from './services/SocketService';
import UserService from './services/UserService';
import RoomService from './services/RoomService';

const app = express();
const {
	jwt: { AccessToken },
} = require('twilio');
const server = http.createServer(app);

const VideoGrant = AccessToken.VideoGrant;
// Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
const MAX_ALLOWED_SESSION_DURATION = 14400;
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;

const socketsArray = [];

app.use(async (req: any, res: any, next: any) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	next();
});

app.get('/token', (request, response) => {
	const identity = request.query.identity;

	if (!identity) {
		return response.status(400).send({
			body: 'An identity is needed',
		});
	}

	const token = new AccessToken(
		process.env.TWILIO_ACCOUNT_SID,
		process.env.TWILIO_API_KEY,
		process.env.TWILIO_API_SECRET,
		{ identity: identity, ttl: MAX_ALLOWED_SESSION_DURATION }
	);

	token.identity = identity;

	const grant = new VideoGrant();
	token.addGrant(grant);

	response.send({
		identity: identity,
		token: token.toJwt(),
	});
});

server.listen(PORT, () => {
	console.log('Server is listening on port ' + PORT);
});

io.on('connection', (socket: Socket) => {
	console.log('Client socket connected !');

	socket.on('@authenticate', ({ username }, callback) => {
		UserController.login({ username }, callback);
		SocketService.addSocket(socket, username);
	});

	// Users
	socket.on('@getUsers', UserController.getUsers);

	// Rooms
	socket.on('@createRoom', RoomController.createRoom);
	socket.on('@getRooms', RoomController.getRooms);
	socket.on('@joinRoom', RoomController.joinRoom);
	socket.on('@leaveRoom', RoomController.leaveRoom);
	socket.on('@startMediation', RoomController.startMediation);

	// Avatars
	socket.on('@sendAvatarData', RoomController.sendAvatarData);

	socket.on('disconnect', (_reason) => {
		console.log('DISCONNECT');
		try {
			const _socket = SocketService.getSocketById(socket.id);
			const username = _socket.username;
			if (!username) return;
			RoomService.disconnectParticipant(username);
			UserService.deleteUser(username);
			SocketService.deleteSocket(_socket.id);
		} catch (error) {
			console.warn('Socket not found !');
		}
	});
});
