const rooms = []

async function getRooms({}, callback) {
    return callback({ code: "SUCCESS", data: { rooms: rooms } })
}

async function createRoom({ roomName }, callback) {
    const room = {
        id: rooms.length + 1,
        name: roomName,
        participants: []
    }
    rooms.push(room)

    return callback({ code: "SUCCESS", data: { room: room } })
}

async function joinRoom({ username, roomId }, callback) {
    const roomIndex = rooms.findIndex(room => room.id === roomId)
    rooms[roomIndex].participants.push({
        username: username,
        isMediator: rooms[roomIndex].participants.length === 0
    })
    return callback({ code: 'SUCCESS', data: { room: rooms[roomIndex] } })
}

async function leaveRoom({ username, roomId }, callback) {
    const roomIndex = rooms.findIndex(room => room.id === roomId)
    const participantIndex = rooms[roomIndex].participants.findIndex(participant => participant.username === username)

    rooms[roomIndex].participants.splice(participantIndex, 1)

    return callback({ code: 'SUCCESS', data: { room: rooms[roomIndex] } })
}

module.exports = { getRooms, createRoom, joinRoom, leaveRoom };