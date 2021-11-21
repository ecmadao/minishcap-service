import { IController } from '../../utils/interfaces/iservice'

export enum RequestMethod {
    Get = 'GET',
    Post = 'POST'
}

export interface IModule {
    method: RequestMethod
    route: string
    handlers: IController[]
}

export interface IRouter {
    modules: IModule[]
    baseUrl: string
}
