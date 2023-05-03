export type Callback = (arg: object) => any

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
    avatar?: AvatarData;
}

export interface Room {
    id: number;
	name: string;
    participants: Participant[];
}
