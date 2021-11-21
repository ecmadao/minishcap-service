import { Document, ObjectId } from 'mongodb'

export interface IShortLink extends Document {
    _id: ObjectId
    id: string
    url: string
    createdAt: Date
    updatedAt: Date
    expiredAt?: Date
}
