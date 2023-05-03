import {
	AvatarEventInput,
	ParticipantData,
	Room,
	RoomData,
} from '../types/business';

const rooms: RoomData[] = [];

function createRoom(name: string): Room {
	const room: RoomData = {
		id: rooms.length + 1,
		name: name,
		participants: [],
	};
	rooms.push(room);
	return room;
}

function getRoomByName(name: string): Room {
	const room = rooms.find((_room) => _room.name === name);
	if (!room) throw new Error('Room not found');
	return { ...room } as Room;
}

function getAllRoom(): Room[] {
	return [...rooms] as Room[];
}

function addRoom(room: RoomData): void {
	rooms.push(room);
}

function deleteRoom(roomId: number): void {
	const index = rooms.findIndex((_room) => _room.id === roomId);
	if (index === -1) throw new Error('Room not found');
	rooms.splice(index, 1);
}

function findRoomByParticipantName(username: string): Room {
	const room = rooms.find((_room) => {
		const index = _room.participants.findIndex(
			(user) => user.name === username
		);
		return index !== -1;
	});
	if (!room) throw new Error('Room not found');
	return { ...room } as Room;
}

function addParticipant(username: string, roomId: number): Room {
	const room = rooms.find((_room) => _room.id === roomId);
	if (!room) throw new Error('Room not found');
	const participant: ParticipantData = {
		name: username,
		role: room.participants.length < 1 ? 'mediator' : 'user',
		emotion: 'Neutral',
	};
	room.participants.push(participant);
	return room;
}

function removeParticipant(username: string, roomId: number): Room {
	const room = rooms.find((_room) => _room.id === roomId);
	if (!room) throw new Error('Room not found');
	const index = room.participants.findIndex((_user) => _user.name === username);
	if (index === -1) throw new Error('Participants not found');
	room.participants.splice(index, 1);
	return { ...room };
}

function disconnectParticipant(username: string): void {
	rooms.forEach((room) => {
		const index = room.participants.findIndex((user) => user.name === username);
		if (index === -1) return;
		room.participants.splice(index, 1);
		if (room.participants.length === 0) deleteRoom(room.id);
	});
}

function setParticipantAvatar(
	username: string,
	roomId: number,
	avatar: AvatarEventInput
): Room {
	const room = rooms.find((_room) => _room.id === roomId);
	if (!room) throw new Error('Room not found');
	const participant = room.participants.find(
		(_user) => _user.name === username
	);
	if (!participant) throw new Error('Participants not found');

	participant.emotion = avatar.emotion;
	participant.avatar = avatar;
	return { ...room } as Room;
}

export default {
	createRoom,
	getRoomByName,
	getAllRoom,
	addRoom,
	deleteRoom,
	findRoomByParticipantName,
	addParticipant,
	removeParticipant,
	disconnectParticipant,
	setParticipantAvatar,
};
