# Mediation 3D Server

## Types

* ### User
```json
{
	name: string
}
```
* ### Participant
```json
{
    name: string
    role: Role
}
```
* ### Room
```json
{
    id: number
	name: string
    participants: Participant[]
}
```
* ### Coordinate
```json
{
	x: number
	y: number
	z: number
}
```
* ### AvatarData
```json 
{
    head: {
        rotation: Coordinate
    }
	hands: {
		right: {
            origin: Coordinate
            points: Coordinate[]
        }
		left: {
            origin: Coordinate
            points: Coordinate[]
        }
	}
}
```

## Websocket Events

* ### @authenticate
Event
```json
{ 
    username: string
}
```
Callback
```json
{
    code: "SUCCESS",
    data: { user },
}
```

* ### @getUsers
Event
```json
{ 

}
```
Callback
```json
{ 
    users: User[]
}
```

* ### @createRoom
Event
```json
{ 
    username: string
    roomName: string
}
```
Callback
```json
{ 
    code: "SUCCESS"
    data: { room: Room }
}
```

* ### @getRooms
Event
```json
{ 

}
```
Callback
```json
{ 
    code: "SUCCESS"
    data: { rooms: Room[] } 
}
```

* ### @joinRoom
Event
```json
{ 
    username: string
    roomId: number 
}
```
Callback
```json
{ 
    code: "SUCCESS"
    data: { room: Room } 
}
```

* ### @leaveRoom
Event
```json
{ 
    username: string
    roomId: number
}
```
Callback
```json
{ 
    code: "SUCCESS"
    data: { }
}
```

* ### @sendAvatarData
Event
```json
{ 
    roomId: number
    username: string
    avatar: AvatarData
}
```
Callback
```json
{ 
    code: "SUCCESS"
    data: { room: Room }
}
```