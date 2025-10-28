class Logger {
    private prefix: string;

    constructor(prefix: string) { // 생성자
        this.prefix = prefix
    }

    log(message: string) {
        console.log(`[${this.prefix}] ${message}`)
    }
}

const appLogger = new Logger("Server");
appLogger.log("Started successfully!");