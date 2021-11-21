import * as controller from './controller'
import { IModule, requestMethod } from '../shared/interfaces'
import { bodyValidation } from '../shared/validation'
import { bodySchema } from './schema'
import { IShortLinkRequestBody } from './interfaces'

export const baseUrl: string = '/urls'

export const modules: IModule[] = [
    {
        method: requestMethod.post,
        route: '/',
        handlers: [
            bodyValidation<IShortLinkRequestBody>(bodySchema),
            controller.generateShortLinks,
        ],
    },
]
