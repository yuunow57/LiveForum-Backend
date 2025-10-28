interface Man {
    id: number;
    nickname: string;
    email?: string; // ? = 선택적 속성, 안써도 됌
}

const me: Man = { id: 1, nickname: "윤호" }

console.log(me);