import { Room } from "../types/business";

const rooms: Room[] = [];

function create(name: string): Room {
    const room: Room = {
        id: rooms.length + 1,
        name: name,
        participants: [],
    };
    rooms.push(room);
    return room;
}

function getByName(name: string): Room | null {
    const room = rooms.find(_room => _room.name === name);
    return room ? {...room} : null;
}

function getAll(): Room[] {
    return [...rooms];
}

function add(room: Room): void {
    rooms.push(room);
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
    create,
    getByName,
    getAll,
    add,
    addParticipant,
    removeParticipant,
}