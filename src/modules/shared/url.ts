import { Db } from 'mongodb'
import { Redis } from 'ioredis'
import { config } from '../../config'
import CustomError from '../../utils/error'
import { logger } from '../../utils/logger'
import { Collections } from '../../utils/mongo'
import { IShortLink } from '../../utils/models'
import { IShortLinkRequest } from '../urls/interfaces'

const getUrlHost = (url: string): string | undefined => url.split('?')[0]?.split(/^https?:\/\//).slice(-1)[0]
export const isShortURL = (url: string) => getUrlHost(url)?.startsWith(getUrlHost(config.host))

export const getShortIdFromDB = async (
    db: Db,
    query: { id?: string, url?: string },
): Promise<IShortLink | undefined> => {
    const res: IShortLink = await db.collection<IShortLink>(Collections.Urls).findOne({
        ...query,
        $or: [
            {
                expiredAt: {
                    $exists: true,
                    $gt: new Date(),
                },
            },
            {
                expiredAt: {
                    $exists: true,
                    $eq: null,
                },
            },
        ],
    })

    logger.debug(`Get existed short link with query: ${JSON.stringify(query)}, res: ${JSON.stringify(res)}`)
    return res
}

// ttl is seconds
const getExpireTime = (ttl: number): Date | undefined => {
    if (ttl < 0) return
    return new Date(new Date().getTime() + ttl * 1000)
}

// one day cache in redis
const cacheTtlInSeconds = 24 * 60 * 60

const getCacheKey = (id: string): string => `shortid.${id}`

const setShortLinkToCache = async (cache: Redis, shortLink: IShortLink): Promise<void> => {
    let ttl = cacheTtlInSeconds
    if (shortLink.expiredAt) {
        ttl = Math.min(
            cacheTtlInSeconds,
            Math.floor((shortLink.expiredAt.getTime() - new Date().getTime()) / 1000),
        )
    }

    logger.debug(`Set TTL ${ttl} for short id ${shortLink.id}`)

    if (ttl <= 0) return
    await cache.set(
        getCacheKey(shortLink.id),
        JSON.stringify(shortLink),
        'EX',
        ttl,
    )
}

const getShortLinkFromCache = async (cache: Redis, id: string): Promise<IShortLink | undefined> => {
    const str = await cache.get(
        getCacheKey(id),
    )

    if (!str) return

    try {
        const res: IShortLink = JSON.parse(str)

        // Refresh TTL
        await setShortLinkToCache(cache, res)
        return res
    } catch (err) {
        logger.error(err)
    }
}

export const setShortLinkToStorage = async (
    db: Db,
    cache: Redis,
    id: string,
    urlRequest: IShortLinkRequest,
): Promise<IShortLink> => {
    const res = await db.collection<IShortLink>(Collections.Urls).findOneAndUpdate(
        { id },
        {
            $set: {
                url: urlRequest.url,
                updatedAt: new Date(),
                expiredAt: getExpireTime(urlRequest.ttlInSeconds),
            },
            $setOnInsert: {
                createdAt: new Date(),
            },
        },
        { upsert: true, returnDocument: 'after' },
    )

    if (!res.ok || !res.value) {
        throw new CustomError.SystemError('Short link creation failed')
    }

    const shortLink: IShortLink = res.value
    await setShortLinkToCache(cache, shortLink)
    return shortLink
}

export const getShortLinkFromStorage = async (
    db: Db,
    cache: Redis,
    id: string,
): Promise<IShortLink | undefined> => {
    const cached: IShortLink = await getShortLinkFromCache(cache, id)
    if (cached !== undefined) return cached

    logger.debug(`Cache for link ${id} expired. Now get from DB`)
    const res: IShortLink = await getShortIdFromDB(db, { id })
    if (res) {
        await setShortLinkToCache(cache, res)
    }
    return res
}
