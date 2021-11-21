import * as fs from 'fs'
import * as path from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import * as Types from '../utils/interfaces/iservice'
import { logger } from '../utils/logger'
import { config } from '../config'
import { IModule, IRouter } from './shared/interfaces'
import { routerSchema } from './shared/schema'

function initRouter(app: Koa) {
    fs.readdirSync(__dirname).forEach((file) => {
        const modPath = path.join(__dirname, file)
        if (file !== 'shared' && fs.statSync(modPath).isDirectory()) {
            /* eslint-disable import/no-dynamic-require, global-require */
            const router: IRouter = require(`${modPath}/router`)

            const check = routerSchema.validate(router)
            if (check.error) {
                throw new Error(`Module ${file} parse failed with error ${check.error}`)
            }

            const routes = router.modules

            let baseUrl = path.join(config.route, router.baseUrl)
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1)
            }

            logger.debug(`Route initial for module ${file} with baseUrl: ${baseUrl}`)

            const instance = new Router({ prefix: baseUrl })

            routes.forEach((routeConfig: IModule) => {
                const {
                    method = '',
                    route = '',
                    handlers = [],
                } = routeConfig

                logger.debug(`method: ${method}, route: ${route}`)

                const lastHandler = handlers.pop()

                instance[method.toLowerCase()](
                    route,
                    ...handlers,
                    async (ctx: Types.ICtx, next: Types.INext) => {
                        await lastHandler(ctx, next)
                    },
                )

                app.use(instance.routes())
                app.use(instance.allowedMethods())
            })
        }
    })
}

export default initRouter
