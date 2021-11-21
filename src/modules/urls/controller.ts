import { Db } from 'mongodb'
import { Redis } from 'ioredis'
import { IController } from '../../utils/interfaces/iservice'
import { IShortLinkRequestBody, IShortLinkRequest, IShortLinkResponse } from './interfaces'
import * as UrlUtils from '../shared/url'
import { config } from '../../config'
import CustomError from '../../utils/error'
import { logger } from '../../utils/logger'
import { generateShortId } from '../../utils/shortid'

const generateShortLink = async (
    db: Db,
    cache: Redis,
    urlRequest: IShortLinkRequest,
): Promise<IShortLinkResponse> => {
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
