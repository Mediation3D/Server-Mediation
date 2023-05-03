import { User } from "../types/business";

const users: User[] = [];

function getByName(name: string): User | null {
    const user = users.find(_user => _user.name === name);
    return user ? {...user} : null;
}

function getAll(): User[] {
    return [...users];
}

function add(user: User): void {
    users.push(user);
}

export default {
    getByName,
    getAll,
    add
}