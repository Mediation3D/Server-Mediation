import { Socket } from '../types/business';

const sockets: Socket[] = [];

function getSocketById(socketId: string): Socket {
	const socket = sockets.find((_socket) => _socket.id === socketId);
	if (!socket) throw new Error('Socket not found');
	return socket;
}

function getSocketByUsername(username: string): Socket {
	const socket = sockets.find((_socket) => _socket.username === username);
	if (!socket) throw new Error('Socket not found');
	return socket;
}

function addSocket(socket: Socket, username?: string): void {
	if (username) socket.username = username;
	const exists = sockets.find((_socket) => _socket.username === username);
	if (exists) throw new Error('Socket already exist with this username');
	sockets.push(socket);
}

function deleteSocket(socketId: string): void {
	const index = sockets.findIndex((_socket) => _socket.id === socketId);
	if (index === -1) throw new Error('Socket not found');
	sockets.splice(index, 1);
}

async function sendToUser(username: string, event: string, args: object) {
	const socket = sockets.find((_socket) => _socket.username === username);
	if (!socket) throw new Error('Socket not found');
	socket.emit(event, args);
}

async function sendToUsers(usernames: string[], event: string, args: object) {
	usernames.forEach((username) => {
		console.log(`Emit ${event} to ${username}`);
		sendToUser(username, event, args)
	});
}

async function sendToAllUsers(event: string, args: object) {
	sockets.forEach((_socket) => {
		console.log(`Emit ${event} to ${_socket.username}`);
		_socket.emit(event, args)
	});
}

export default {
	getSocketById,
	getSocketByUsername,
	addSocket,
	deleteSocket,
	sendToUser,
	sendToUsers,
	sendToAllUsers,
};
