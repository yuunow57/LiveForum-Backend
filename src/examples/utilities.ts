interface Post {
    id: number;
    title: string;
    content: string;
}

// 부분 수정용 타입
const updatePost: Partial<Post> = { title: "새 제목" };
// 특정 필드만 선택
type postPreview = Pick<Post, "id" | "title">;

const pp: postPreview = { id: 1, title: "타이타닉" };

console.log(updatePost);
console.log(pp);