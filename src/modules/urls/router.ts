import { bodySchema } from './schema'
import * as controller from './controller'
import { bodyValidation } from '../shared/validation'
import { IShortLinkRequestBody } from './interfaces'
import { IModule, RequestMethod } from '../shared/interfaces'

export const baseUrl: string = '/api/v1/urls'

export const modules: IModule[] = [
    {
        method: RequestMethod.Post,
        route: '/',
        handlers: [
            bodyValidation<IShortLinkRequestBody>(bodySchema),
            controller.generateShortLinks,
        ],
    },
]
