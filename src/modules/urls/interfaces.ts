export interface IShortLinkRequest {
    url: string
    ttlInSeconds: number // TTL in seconds
}

export interface IShortLinkRequestBody {
    urls: IShortLinkRequest[]
}

export interface IShortLinkResponse {
    short?: string
    raw: string
    expiredAt?: Date
}
