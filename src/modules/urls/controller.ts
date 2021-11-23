import { Db } from 'mongodb'
import { Redis } from 'ioredis'
import { config } from '../../config'
import * as UrlUtils from '../shared/url'
import CustomError from '../../utils/error'
import { logger } from '../../utils/logger'
import { generateShortId } from '../../utils/shortid'
import { IController } from '../../utils/interfaces'
import { IShortLinkRequestBody, IShortLinkRequest, IShortLinkResponse } from './interfaces'

const generateShortLink = async (
    db: Db,
    cache: Redis,
    urlRequest: IShortLinkRequest,
): Promise<IShortLinkResponse> => {
    logger.debug(`Start generate short link for ${JSON.stringify(urlRequest)}`)
    if (UrlUtils.isShortURL(urlRequest.url)) {
        return {
            short: null,
            raw: urlRequest.url,
            expiredAt: null,
        }
    }

    // Q: can the raw URL has query?
    let shortlink = await UrlUtils.getShortIdFromDB(db, { url: urlRequest.url })
    if (!shortlink) {
        const id = await generateShortId(cache)
        if (!id) throw new CustomError.SystemError('Shork link generation failed')

        shortlink = await UrlUtils.setShortLinkToStorage(db, cache, id, urlRequest)
    }

    return {
        short: new URL(shortlink.id, config.host).href,
        raw: shortlink.url,
        expiredAt: shortlink.expiredAt,
    }
}

export const generateShortLinks: IController = async (ctx) => {
    const { urls } = ctx.request.body as IShortLinkRequestBody
    const res = await Promise.all(
        urls.map(async (urlRequest) => {
            try {
                const short = await generateShortLink(ctx.db, ctx.cache, urlRequest)
                logger.debug(`Generate short link for url ${urlRequest.url} -> ${JSON.stringify(short)}`)
                return short
            } catch (err) {
                logger.error(err)
                return {
                    short: null,
                    raw: urlRequest.url,
                    expiredAt: null,
                }
            }
        }),
    )

    ctx.body = {
        success: true,
        result: res,
    }
}
