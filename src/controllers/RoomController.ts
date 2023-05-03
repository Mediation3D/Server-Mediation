import { Callback, Room } from "../types/business";
import RoomService from "../services/RoomService";

async function getRooms({}, callback: Callback) {
  const rooms = RoomService.getAll();
  return callback({ code: "SUCCESS", data: { rooms } });
}

async function createRoom(args: { roomName: string }, callback: Callback) {
  const room = RoomService.create(args.roomName);
  return callback({ code: "SUCCESS", data: { room } });
}

async function joinRoom(
  args: { username: string; roomId: number },
  callback: Callback
) {
  try {
    const room = RoomService.addParticipant(args.username, args.roomId);
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
    return callback({ code: "SUCCESS", data: { room } });
  } catch (error: any) {
    return callback({ code: "FAILED", message: error.message });
  }
}

export default { getRooms, createRoom, joinRoom, leaveRoom };
