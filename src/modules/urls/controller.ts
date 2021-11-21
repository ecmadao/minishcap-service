import { Db } from 'mongodb'
import * as path from 'path'
import { IController } from '../../utils/interfaces/iservice'
import { IShortLinkRequestBody, IShortLinkRequest } from './interfaces'
import * as UrlUtils from '../shared/url'
import { config } from '../../config'
import CustomError from '../../utils/error'
import { logger } from '../../utils/logger'

const generateShortLink = async (db: Db, urlRequest: IShortLinkRequest): Promise<string> => {
    const url = urlRequest.url.split('?')[0]

    if (UrlUtils.isShortURL(url)) {
        return url
    }

    const existed = await UrlUtils.getShortIdFromDB(db, { url })
    let id = existed?.id
    if (!id) {
        id = await UrlUtils.generateShortId(db, urlRequest)

        if (!id) throw new CustomError.SystemError('Shork link generation failed')
    }

    return path.join(config.host, id)
}

export const generateShortLinks: IController = async (ctx) => {
    const { urls } = ctx.request.body as IShortLinkRequestBody
    const res = await Promise.all(
        urls.map(async (urlRequest) => {
            try {
                const short = await generateShortLink(ctx.db, urlRequest)
                logger.debug(`Generate short link for url ${urlRequest.url} -> ${short}`)
                return short
            } catch (err) {
                logger.error(err)
                return ''
            }
        }),
    )

    ctx.body = {
        success: true,
        result: res,
    }
}
