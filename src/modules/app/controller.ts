import { IController } from '../../utils/interfaces/iservice'
import { logger } from '../../utils/logger'
import { getShortLinkFromStorage } from '../shared/url'
import CustomError from '../../utils/error'

export const goHome: IController = async (ctx) => {
    const { shortid } = ctx.params
    if (!shortid) throw new CustomError.NotFoundError()

    const shortlink = await getShortLinkFromStorage(ctx.db, ctx.cache, shortid)
    if (!shortlink) throw new CustomError.NotFoundError()

    logger.debug(`Get the short link: ${JSON.stringify(shortlink)} for id: ${shortid}`)

    // Use 302 redirect in default
    ctx.redirect(shortlink.url)
}
