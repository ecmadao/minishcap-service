import * as controller from './controller'
import { IModule, RequestMethod } from '../shared/interfaces'

export const baseUrl: string = '/'

export const modules: IModule[] = [
    {
        method: RequestMethod.Get,
        route: '/',
        handlers: [
            controller.goHome,
        ],
    },
]
