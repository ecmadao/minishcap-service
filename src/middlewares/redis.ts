import { Redis } from 'ioredis'
import { getRedis } from '../utils/redis'
import { IController } from '../utils/interfaces/iservice'

declare module 'koa' {
    interface Context { // eslint-disable-line no-unused-vars
        cache: Redis
    }
}

export const redisMiddleware: IController = async (ctx, next) => {
    ctx.cache = getRedis()
    await next()
}
