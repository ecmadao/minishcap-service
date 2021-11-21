import Joi from 'joi'

export const bodySchema = Joi.object({
    urls: Joi.array().items(
        Joi.string().required().uri(),
    ).min(1).max(100),
})
