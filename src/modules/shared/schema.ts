import Joi from 'joi'
import { requestMethod } from './interfaces'

const moduleSchema = Joi.object({
    method: Joi.string().required().valid(requestMethod.get, requestMethod.post),
    route: Joi.string().required().regex(/^\//),
    handlers: Joi.array().required().items(Joi.any()).min(1),
})

export const routerSchema = Joi.object({
    baseUrl: Joi.string().required().regex(/^\//),
    modules: Joi.array().required().items(moduleSchema).min(1),
})
