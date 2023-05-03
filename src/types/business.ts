import { Socket as SocketIO } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export type Callback = (arg: object) => any

export type Socket = SocketIO<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> & {username?: string}

export interface Coordinate {
	x: number
	y: number
	z: number
}

export interface HandPosition {
	origin: Coordinate
	points: Coordinate[]
}

export interface HeadData {
	rotation: Coordinate
}

export interface AvatarData {
    head: HeadData
	hands: {
		right: HandPosition
		left: HandPosition
	}
}

export type Role = 'mediator' | 'lawyer' | 'user'

export interface User {
	name: string;
}

export interface Participant extends User {
    role: Role;
}

export interface ParticipantData extends Participant {
    avatar?: AvatarData;
}

export interface Room {
    id: number;
	name: string;
    participants: Participant[];
}

export interface RoomData extends Omit<Room, 'participants'> {
    participants: ParticipantData[];
}
