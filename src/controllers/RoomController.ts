import { AvatarData, Callback } from "../types/business";
import RoomService from "../services/RoomService";
import SocketService from "../services/SocketService";

async function getRooms({}, callback: Callback) {
  const rooms = RoomService.getAllRoom();
  return callback({ code: "SUCCESS", data: { rooms } });
}

async function createRoom(
  args: { username: string; roomName: string },
  callback: Callback
) {
  const newRoom = RoomService.createRoom(args.roomName);
  const room = RoomService.addParticipant(args.username, newRoom.id);
  return callback({ code: "SUCCESS", data: { room } });
}

async function joinRoom(
  args: { username: string; roomId: number },
  callback: Callback
) {
  try {
    const room = RoomService.addParticipant(args.username, args.roomId);

    const usernames = room.participants.map((participant) => participant.name)
        .filter((_usernames) => _usernames !== args.username);
    SocketService.sendToUsers(usernames, {
        event: '@emitParticipantAdded',
        data: {
          room: room.name,
          username: args.username,
        }
    });

    return callback({ code: "SUCCESS", data: { room } });
  } catch (error: any) {
    return callback({ code: "FAILED", message: error.message });
  }
}

async function leaveRoom(
  args: { username: string; roomId: number },
  callback: Callback
) {
  try {
    const room = RoomService.removeParticipant(args.username, args.roomId);
    if (room.participants.length === 0) RoomService.deleteRoom(room.id);

    const usernames = room.participants.map((participant) => participant.name)
        .filter((_usernames) => _usernames !== args.username);
    SocketService.sendToUsers(usernames, {
      event: '@emitParticipantRemoved',
      data: {
        room: room.name,
        username: args.username,
      }
    });

    return callback({ code: "SUCCESS", data: {} });
  } catch (error: any) {
    return callback({ code: "FAILED", message: error.message });
  }
}

async function sendAvatarData(
  args: { roomId: number; username: string; avatar: AvatarData },
  callback: Callback
) {
  try {
    const room = RoomService.setParticipantAvatar(
      args.username,
      args.roomId,
      args.avatar
    );

    const usernames = room.participants.map((participant) => participant.name)
        .filter((_usernames) => _usernames !== args.username);
    SocketService.sendToUsers(usernames, {
        event: '@emitAvatar',
        data: args.avatar
    });

    return callback({ code: "SUCCESS", data: { room } });
  } catch (error: any) {
    return callback({ code: "FAILED", message: error.message });
  }
}

export default { getRooms, createRoom, joinRoom, leaveRoom, sendAvatarData };
