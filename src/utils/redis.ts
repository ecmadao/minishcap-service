import IoRedis from 'ioredis'
import { config } from '../config'
import { logger } from './logger'
import { IRedis } from '../config/interfaces'

let instance = null

export function getRedis(keyPrefix = `${config.appName}.`): IoRedis.Redis {
    if (instance) return instance

    const dbConf = ({ ...config.storage.redis, keyPrefix }) as IRedis
    logger.info(`[Redis:connection] ${JSON.stringify(dbConf)}`)
    instance = new IoRedis(dbConf)
    return instance
}
