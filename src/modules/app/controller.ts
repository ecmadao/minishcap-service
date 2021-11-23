import { logger } from '../../utils/logger'
import CustomError from '../../utils/error'
import { getShortLinkFromStorage } from '../shared/url'
import { IController } from '../../utils/interfaces'

export const goHome: IController = async (ctx) => {
    const { shortid } = ctx.params
    if (!shortid) throw new CustomError.NotFoundError()

    const shortlink = await getShortLinkFromStorage(ctx.db, ctx.cache, shortid)
    if (!shortlink) throw new CustomError.NotFoundError()

    logger.debug(`Get the short link: ${JSON.stringify(shortlink)} for id: ${shortid}`)

    const raw = shortlink.url
    // Use 302 redirect in default
    ctx.redirect(
        /^(https?|ftp):\/\//.test(raw) ? raw : `//${raw}`,
    )
}
