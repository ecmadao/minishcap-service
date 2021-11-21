export interface IShortLink {
    id: string
    url: string
    createdAt: Date
    updatedAt: Date
    expiredAt?: Date
}
