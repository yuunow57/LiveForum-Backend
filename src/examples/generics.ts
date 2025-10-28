function wrap<T>(value: T): { data: T } {
    return { data: value };
}

const wrapped = wrap<string>("NestJS is cool");

console.log(wrapped);