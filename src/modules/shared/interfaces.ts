import { IController } from '../../utils/interfaces/iservice'

export enum requestMethod {
    get = 'GET',
    post = 'POST'
}

export interface IModule {
    method: requestMethod
    route: string
    handlers: IController[]
}

export interface IRouter {
    modules: IModule[]
    baseUrl: string
}
