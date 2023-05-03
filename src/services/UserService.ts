import { User } from "../types/business";

const users: User[] = [];

function getUserByName(name: string): User {
    const user = users.find(_user => _user.name === name);
    if (!user) throw new Error("User not found");
    return user;
}

function getAllUser(): User[] {
    return [...users];
}

function addUser(user: User): void {
    users.push(user);
}

export default {
    getUserByName,
    getAllUser,
    addUser
}