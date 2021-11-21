import * as mongodb from 'mongodb'
import { config } from '../config'
import { logger } from './logger'

const instance = {}

export enum Collections {
  Urls = 'urls',
  Stat = 'stat',
}

export const getMongo = (options: { url: string, dbName: string }): Promise<mongodb.Db> => {
    const {
        url = config.storage.mongo.url,
        dbName = config.storage.mongo.dbName,
    } = options

    return new Promise((resolve, reject) => {
        if (instance[url]) {
            resolve(instance[url])
        } else {
            mongodb.MongoClient.connect(
                url,
                { useNewUrlParser: true, useUnifiedTopology: true },
                (err, client) => {
                    if (err) {
                        logger.error(err)
                        reject(err)
                    }
                    logger.info(`[MONGODB CONNECTED] ${JSON.stringify(options)}`)
                    const db = client.db(dbName)
                    instance[url] = db
                    resolve(db)
                },
            )
        }
    })
}

export async function initDatabaseIndexs(options: { url: string, dbName: string }) {
    const db = await getMongo(options)

    try {
        await db.collection(Collections.Urls).createIndex(
            { id: 1 },
            { name: 'id', background: true, unique: true },
        )
    } catch (e) {
        logger.error(e)
    }
}
