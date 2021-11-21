import * as controller from './controller'
import { IModule, requestMethod } from '../shared/interfaces'

export const baseUrl: string = '/'

export const modules: IModule[] = [
    {
        method: requestMethod.get,
        route: '/',
        handlers: [
            controller.goHome,
        ],
    },
]
