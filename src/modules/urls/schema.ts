import Joi from 'joi'
import validator from 'validator'

const urlSchema = Joi.object({
    url: Joi.string().required().custom((val) => {
        if (!validator.isURL(val)) {
            throw new Error(`${val} is not a valid URL`)
        }
        return true
    }),
    ttlInSeconds: Joi.number().required().min(-1),
})

export const bodySchema = Joi.object({
    urls: Joi.array().required().items(
        urlSchema,
    ).min(1)
        .max(10),
})
