const users = []

async function login({ username }, callback) {
    users.push(username);
    return callback({
        code: "SUCCESS",
        data: { username: username }
    });
}

async function getUsers({}, callback) {
    return callback({ code: "SUCCESS", data: { users: users } })
}


module.exports = { login, getUsers };