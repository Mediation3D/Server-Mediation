import { Callback, User } from "../types/business";
import UserService from "../services/UserService";

async function login(args: { username: string }, callback: Callback) {
    const user: User = {
        name: args.username,
    };
    UserService.addUser(user)
    return callback({
        code: "SUCCESS",
        data: { user },
    });
}

async function getUsers({}, callback: Callback) {
    const users = UserService.getAllUser()
    return callback({ code: "SUCCESS", data: { users } });
}

export default { login, getUsers };
