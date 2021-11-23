import * as Koa from 'koa'

export type INext = () => Promise<any>
export type ICtx = Koa.Context

export interface IController {
    (ctx: ICtx, next?: INext): Promise<void>
}
