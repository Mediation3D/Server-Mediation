import { Room } from "../types/business";

const rooms: Room[] = [];

function createRoom(name: string): Room {
    const room: Room = {
        id: rooms.length + 1,
        name: name,
        participants: [],
    };
    rooms.push(room);
    return room;
}

function getRoomByName(name: string): Room | null {
    const room = rooms.find(_room => _room.name === name);
    return room ? {...room} : null;
}

function getAllRoom(): Room[] {
    return [...rooms];
}

function addRoom(room: Room): void {
    rooms.push(room);
}

function deleteRoom(roomId: number): void {
    const index = rooms.findIndex(_room => _room.id === roomId);
    if (index === -1) throw new Error('Room not found');
    rooms.splice(index, 1);
}

function addParticipant(username: string, roomId: number): Room {
    const room = rooms.find(_room => _room.id === roomId);
    if (!room) throw new Error('Room not found');
    room.participants.push({
        name: username,
        role: room.participants.length < 1 ? 'mediator' : 'user'
    });
    return {...room};
}

function removeParticipant(username: string, roomId: number): Room {
    const room = rooms.find(_room => _room.id === roomId);
    if (!room) throw new Error('Room not found');
    const index = room.participants.findIndex(_user => _user.name === username);
    if (index === -1) throw new Error('Participants not found');
    room.participants.splice(index, 1);
    return {...room};
}

export default {
    createRoom,
    getRoomByName,
    getAllRoom,
    addRoom,
    addParticipant,
    removeParticipant,
}