import { logger } from '../utils/logger'
import { ERRORS } from '../utils/error'
import { IController } from '../utils/interfaces'

export const errorMiddleware: IController = async (ctx, next) => {
    try {
        await next()
        logger.info(`ctx.status: ${ctx.status}`)
    } catch (err) {
        const code = err.errorCode ?? ERRORS.SystemError.code
        const name = err.errName ?? ERRORS.SystemError.name
        ctx.status = code
        ctx.body = {
            success: false,
            error: name,
            message: err.message || '',
            results: null,
        }

        logger.error(err)
        logger.error(JSON.stringify(ctx.body))
        ctx.app.emit('error', err, ctx)
    }
}
