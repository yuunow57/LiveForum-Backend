import { Module, Global } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-ioredis-yet";

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async() => ({
                store: await redisStore({
                    host: process.env.REDIS_HOST,
                    port: Number(process.env.REDIS_PORT),
                    ttl: 0,
                }),
            }),
        }),
    ],
    exports: [CacheModule],
})

export class RedisModule {}