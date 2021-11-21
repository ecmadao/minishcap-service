import { Db } from 'mongodb'
import shortid from 'shortid'
import { Collections } from '../../utils/mongo'
import { IShortLink } from '../../utils/models/ishortlink'
import { IShortLinkRequest } from '../urls/interfaces'

export const isShortId = (id: string) => shortid.isValid(id)

export const isShortURL = (url: string) => isShortId(
    url.split('?')[0]?.split('/').slice(-1)[0],
)

export const getShortIdFromDB = async (
    db: Db,
    query: { id?: string, url?: string },
): Promise<IShortLink | undefined> => {
    const res: IShortLink = await db.collection(Collections.Urls).findOne({
        query,
    })

    return res
}

export const generateShortId = (db: Db, urlRequest: IShortLinkRequest): Promise<string | undefined> => Promise.resolve('1')
