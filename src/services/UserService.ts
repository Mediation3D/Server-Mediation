import { User } from '../types/business';

const users: User[] = [];

function getUserByName(name: string): User {
	const user = users.find((_user) => _user.name === name);
	if (!user) throw new Error('User not found');
	return user;
}

function getAllUser(): User[] {
	return [...users];
}

function addUser(user: User): void {
	users.push(user);
}

function deleteUser(username: string): void {
	const index = users.findIndex((_user) => _user.name === username);
	if (index === -1) throw new Error('User not found');
	users.splice(index, 1);
}

export default {
	getUserByName,
	getAllUser,
	addUser,
	deleteUser,
};
