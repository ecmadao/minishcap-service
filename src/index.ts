import Koa from 'koa'
import koaLogger from 'koa-logger'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import apiLimit from 'koa2-ratelimit'
import { config } from './config'
import { initRouter } from './modules'
import { logger } from './utils/logger'
import { errorMiddleware } from './middlewares/error'
import { mongoMiddleware } from './middlewares/mongo'
import { redisMiddleware } from './middlewares/redis'
import { getMongo, initDatabaseIndexs } from './utils/mongo'

const limiter = apiLimit.RateLimit.middleware({
    interval: { min: 1 }, // 1 minutes
    max: 100, // limit each IP to 100 requests per interval
})

const app = new Koa()

app.use(cors())
app.use(errorMiddleware)
app.use(koaLogger())
app.use(limiter)

app.use(bodyParser({
    enableTypes: ['json'],
}))

app.use(mongoMiddleware)
app.use(redisMiddleware)

initRouter(app)

const init = async () => {
    try {
        await getMongo(config.storage.mongo)
        await initDatabaseIndexs(config.storage.mongo)

        app.listen(config.port, () => {
            logger.info(`[SERVER RUNNING][${config.port}]`)
        })
    } catch (err) {
        logger.error(`[ERROR][${err || err.stack}]`)
    }
}

init()

export default app
