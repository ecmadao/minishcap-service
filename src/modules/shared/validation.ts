import { ObjectSchema } from 'joi'
import CustomError from '../../utils/error'
import { IController } from '../../utils/interfaces'

export function bodyValidation<T>(schema: ObjectSchema): IController {
    return async (ctx, next) => {
        const data = ctx.request.body as T
        const result = schema.validate(data)

        if (result.error) {
            throw new CustomError.ParameterError(`Invalid request body ${result.error}`)
        }

        await next()
    }
}
