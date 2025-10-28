"use strict";
class Logger {
    constructor(prefix) {
        this.prefix = prefix;
    }
    log(message) {
        console.log(`[${this.prefix}] ${message}`);
    }
}
const appLogger = new Logger("Server");
appLogger.log("Started successfully!");
//# sourceMappingURL=modifiers.js.map