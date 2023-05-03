import { Socket } from "../types/business";

const sockets: Socket[] = [];

function getSocketById(socketId: string): Socket {
    const socket = sockets.find(_socket => _socket.id === socketId);
    if (!socket) throw new Error('Socket not found');
    return socket;
}

function getSocketByUsername(username: string): Socket {
    const socket = sockets.find(_socket => _socket.username === username);
    if (!socket) throw new Error('Socket not found');
    return socket;
}

function addSocket(socket: Socket, username?: string): void {
    if (username) socket.username = username;
    const exists = sockets.find(_socket => _socket.username === username);
    if (exists) throw new Error('Socket already exist with this username');
    sockets.push(socket);
}

function deleteSocket(socketId: string): void {
    const index = sockets.findIndex(_socket => _socket.id === socketId);
    if (index === -1) throw new Error('Socket not found');
    sockets.splice(index, 1);
}

function sendToUser(username: string, args: object) {
    const socket = sockets.find(_socket => _socket.username === username);
    if (!socket) throw new Error('Socket not found');
    socket.send(args);
}

function sendToUsers(usernames: string[], args: object) {
    usernames.forEach(username => sendToUser(username, args));
}

export default {
    getSocketById,
    getSocketByUsername,
    addSocket,
    deleteSocket,
    sendToUser,
    sendToUsers,
}