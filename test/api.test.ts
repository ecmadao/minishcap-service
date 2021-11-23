import * as supertest from 'supertest'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import app from '../src/index'
import { IResponseBody } from '../src/utils/interfaces'
import { IShortLinkResponse } from '../src/modules/urls/interfaces'
import { config } from '../src/config'

const request = supertest.agent(app.listen())
const uri = '/api/v1/urls'

describe('APIs test', () => {
    after(async () => {
        // TODO: we should dump test db here
    })

    it(`Should get 400 response for POST ${uri} cause non-body`, async () => {
        const response = await request.post(uri).send()
        expect(response.statusCode).equal(400)
    })

    it(`Should get 400 response for POST ${uri} cause empty body`, async () => {
        const response = await request.post(uri).send({
            urls: [],
        })
        expect(response.statusCode).equal(400)
    })

    it(`Should get 400 response for POST ${uri} cause wrong schema`, async () => {
        const response = await request.post(uri).send({
            urls: [
                {
                    test: '1',
                },
            ],
        })
        expect(response.statusCode).equal(400)
    })

    it(`Should get 400 response for POST ${uri} cause wrong url`, async () => {
        const response = await request.post(uri).send({
            urls: [
                {
                    url: '123',
                    ttlInSeconds: -1,
                },
            ],
        })
        expect(response.statusCode).equal(400)
    })

    it(`Should get 200 response for POST ${uri} with short url and expire time`, async () => {
        const url = 'google.com'
        const response = await request.post(uri).send({
            urls: [
                {
                    url,
                    ttlInSeconds: 1,
                },
            ],
        })
        expect(response.statusCode).equal(200)
        const data: IResponseBody<IShortLinkResponse[]> = response.body
        expect(data.success).equal(true)
        expect(!!data.result).equal(true)
        expect(data.result?.length).equal(1)

        const shortLink = data.result[0]
        expect(shortLink.raw).equal(url)
        expect(!!shortLink.short).equal(true)
        expect(shortLink.short?.startsWith(config.host)).equal(true)
        expect(!!shortLink.expiredAt).equal(true)
    })

    it(`Should get 200 response for POST ${uri} with short url and none expire time`, async () => {
        const url = 'example.com'
        let response = await request.post(uri).send({
            urls: [
                {
                    url,
                    ttlInSeconds: -1,
                },
            ],
        })

        expect(response.statusCode).equal(200)
        let data: IResponseBody<IShortLinkResponse[]> = response.body
        expect(data.success).equal(true)

        const shortLink = data.result[0]
        expect(!!shortLink.expiredAt).equal(false)
        expect(!!shortLink.short).equal(true)

        response = await request.post(uri).send({
            urls: [
                {
                    url,
                    ttlInSeconds: -1,
                },
            ],
        })
        expect(response.statusCode).equal(200)
        data = response.body
        expect(!!data.result[0].short).equal(true)
        expect(!!data.result[0].expiredAt).equal(false)
    })

    it(`Should get 200 response for POST ${uri} with short url, but have failed result`, async () => {
        const response = await request.post(uri).send({
            urls: [
                {
                    url: 'github.com',
                    ttlInSeconds: 1,
                },
                {
                    url: `${config.host}/1`,
                    ttlInSeconds: 1,
                },
            ],
        })

        expect(response.statusCode).equal(200)
        const data: IResponseBody<IShortLinkResponse[]> = response.body
        expect(data.success).equal(true)
        expect(data.result?.length).equal(2)

        // eslint-disable-next-line no-restricted-syntax
        for (const shortLink of data.result) {
            if (shortLink.raw.startsWith(config.host)) {
                expect(!!shortLink.short).equal(false)
                expect(!!shortLink.expiredAt).equal(false)
            }
        }
    })

    it('Should get 302 response for short link redirect', async () => {
        let response = await request.post(uri).send({
            urls: [
                {
                    url: 'hacknical.com',
                    ttlInSeconds: 10,
                },
            ],
        })

        expect(response.statusCode).equal(200)
        const { short } = response.body.result[0]
        expect(!!short).equal(true)
        expect(short.startsWith(config.host))

        const path = short.split(config.host).slice(-1)[0]
        response = await request.get(path).send()
        expect(response.statusCode).equal(302)
    })

    it('Should get 404 response for not existed short link', async () => {
        const response = await request.get('/not-exist').send()
        expect(response.statusCode).equal(404)
    })
})
