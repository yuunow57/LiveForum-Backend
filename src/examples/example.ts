interface User {
    id: number;
    name: string;
    isActive: boolean;
}

const users: User[] = [
    { id: 1, name: "윤호", isActive: true },
    { id: 2, name: "유노", isActive: false},
];

function getActiveUsers(list: User[]): User[] {
    return list.filter((u) => u.isActive);
}

console.log("활성 유저", getActiveUsers(users));