import Joi from 'joi'
import validator from 'validator'

const redisSchema = Joi.object({
    host: Joi.string().required(),
    port: Joi.number().required(),
    db: Joi.number().required(),
    password: Joi.string().optional(),
    keyPrefix: Joi.string().optional(),
})

const mongoSchema = Joi.object({
    url: Joi.string().required(),
    dbName: Joi.string().required(),
})

const loggerSchema = Joi.object({
    appenders: Joi.object({
        consoleLog: Joi.object({
            type: Joi.string().valid('file', 'console'),
        }),
    }),
    categories: Joi.object({
        default: Joi.object({
            appenders: Joi.array().items(
                Joi.string().valid('consoleLog').min(1),
            ),
            level: Joi.string().valid('debug', 'info'),
        }),
    }),
})

export const configSchema = Joi.object({
    port: Joi.number().required(),
    appName: Joi.string().required(),
    host: Joi.string().required().custom((val) => {
        if (!validator.isURL(val)) {
            throw new Error(`${val} is not a valid URL`)
        }
        return true
    }),
    storage: Joi.object({
        mongo: mongoSchema,
        redis: redisSchema,
    }),
    logger: loggerSchema,
})
