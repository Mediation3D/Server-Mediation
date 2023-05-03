import { User } from "../types/business";

const users: User[] = [];

function getUserByName(name: string): User | null {
    const user = users.find(_user => _user.name === name);
    return user ? {...user} : null;
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