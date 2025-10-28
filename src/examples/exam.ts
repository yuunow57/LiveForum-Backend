// // 1번
// let UserId: number | string;

// // 2번
// interface User {
//     name: string;
//     age: number;
// }

// const user: User = {
//     name: "yuno",
//     age: 28,
// }
// // 3번
// const updateProduct: Partial<Product> = { name: "yuunow" };

// // 4번
// type ArticlePreview: Pick<Article, "id" | "title">;

// 5번
// function wrap<T>(value: T): { data: T } {
//     return { data: value };
// }

// // 6번
// class Logger {
//     private prefix: string;

//     constructor(prefix: string) {
//         this.prefix = prefix;
//     }

//     log(message: string) {
//         console.log(`[${this.prefix}] ${message}`);
//     }
// }