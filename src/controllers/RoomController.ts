import { AvatarEventInput, Callback, RoomConfig, RoomData } from '../types/business';
import RoomService from '../services/RoomService';
import SocketService from '../services/SocketService';

async function getRooms({}, callback: Callback) {
	const rooms = RoomService.getAllRoom();
	return callback({ code: 'SUCCESS', data: { rooms } });
}

async function createRoom(
	args: { username: string; roomName: string },
	callback: Callback
) {
	const newRoom = RoomService.createRoom(args.roomName);
	const room = RoomService.addParticipant(args.username, newRoom.id);
	SocketService.sendToAllUsers('@RoomCreated', {
		room,
	});
	return callback({ code: 'SUCCESS', data: { room } });
}

async function joinRoom(
	args: { username: string; roomId: number },
	callback: Callback
) {
	try {
		const room = RoomService.addParticipant(args.username, args.roomId);

		SocketService.sendToAllUsers('@ParticipantAdded', {
			roomId: room.id,
			participant: room.participants.find(
				(_participant) => _participant.name === args.username
			),
		});

		return callback({ code: 'SUCCESS', data: { room: room } });
	} catch (error: any) {
		return callback({ code: 'FAILED', message: error.message });
	}
}

async function leaveRoom(
	args: { username: string; roomId: number },
	callback: Callback
) {
	try {
		const room = RoomService.removeParticipant(args.username, args.roomId);
		if (room.participants.length === 0) {
			const roomId = room.id;
			RoomService.deleteRoom(room.id);
			SocketService.sendToAllUsers('@RoomDeleted', {
				roomId,
			});
		} else {
			SocketService.sendToAllUsers('@ParticipantRemoved', {
				roomId: room.id,
				username: args.username,
			});
		}

		return callback({ code: 'SUCCESS', data: { room } });
	} catch (error: any) {
		return callback({ code: 'FAILED', message: error.message });
	}
}

async function sendAvatarData(
	args: { username: string; roomId: number; avatar: AvatarEventInput },
	callback: Callback
) {
	try {
		const room = RoomService.setParticipantAvatar(
			args.username,
			args.roomId,
			args.avatar
		);

		const usernames = room.participants
			.map((participant) => participant.name)
			.filter((_usernames) => _usernames !== args.username);
		SocketService.sendToUsers(usernames, '@AvatarData', {
			roomId: room.id,
			username: args.username,
			data: args.avatar,
		});

		return callback({ code: 'SUCCESS', data: { room } });
	} catch (error: any) {
		return callback({ code: 'FAILED', message: error.message });
	}
}

async function startMediation(
	args: { username: string; roomId: number, config: RoomConfig },
	callback: Callback
) {
	try {
		const room = RoomService.getRoomById(args.roomId);

		room.config = args.config;
		room.state = 'mediation';

		const usernames = room.participants
			.map((participant) => participant.name)
			.filter((_usernames) => _usernames !== args.username);
		SocketService.sendToUsers(usernames, '@MediationStarted', {
			room,
			mediator: args.username,
		});

		return callback({ code: 'SUCCESS', data: { room } });
	} catch (error: any) {
		return callback({ code: 'FAILED', message: error.message });
	}
}

export default { getRooms, createRoom, joinRoom, leaveRoom, sendAvatarData, startMediation };
