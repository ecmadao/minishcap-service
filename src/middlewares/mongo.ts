import { Db } from 'mongodb'
import { config } from '../config'
import { getMongo } from '../utils/mongo'
import { IController } from '../utils/interfaces/iservice'

declare module 'koa' {
    interface Context { // eslint-disable-line no-unused-vars
        db: Db
    }
}

export const mongoMiddleware: IController = async (ctx, next) => {
    ctx.db = await getMongo(config.storage.mongo)
    await next()
}
