import Joi from 'joi'

const urlSchema = Joi.object({
    url: Joi.string().required().uri(),
    ttlInSeconds: Joi.number().required().min(-1),
})

export const bodySchema = Joi.object({
    urls: Joi.array().items(
        urlSchema,
    ).min(1).max(10),
})
