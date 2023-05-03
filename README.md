# Mediation 3D Server

## Types

* ### User
```js
{
	name: string
}
```
* ### Participant
```js
{
    name: string
    role: Role
}
```
* ### Room
```js
{
    id: number
	name: string
    participants: Participant[]
}
```
* ### Coordinate
```js
{
	x: number
	y: number
	z: number
}
```
* ### AvatarData
```js 
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
```js
{ 
    username: string
}
```
Callback
```js
{
    code: "SUCCESS",
    data: { user: User },
}
```

* ### @getUsers
Event
```js
{ 

}
```
Callback
```js
{ 
    users: User[]
}
```

* ### @createRoom
Event
```js
{ 
    username: string
    roomName: string
}
```
Callback
```js
{ 
    code: "SUCCESS"
    data: { room: Room }
}
```

* ### @getRooms
Event
```js
{ 

}
```
Callback
```js
{ 
    code: "SUCCESS"
    data: { rooms: Room[] } 
}
```

* ### @joinRoom
Event
```js
{ 
    username: string
    roomId: number 
}
```
Callback
```js
{ 
    code: "SUCCESS"
    data: { room: Room } 
}
```

* ### @leaveRoom
Event
```js
{ 
    username: string
    roomId: number
}
```
Callback
```js
{ 
    code: "SUCCESS"
    data: { }
}
```

* ### @sendAvatarData
Event
```js
{ 
    roomId: number
    username: string
    avatar: AvatarData
}
```
Callback
```js
{ 
    code: "SUCCESS"
    data: { room: Room }
}
```