import * as controller from './controller'
import { IModule, RequestMethod } from '../shared/interfaces'
import { bodyValidation } from '../shared/validation'
import { bodySchema } from './schema'
import { IShortLinkRequestBody } from './interfaces'

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
