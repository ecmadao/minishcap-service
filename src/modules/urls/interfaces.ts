export interface IShortLinkRequest {
    url: string
    ttl: number // TTL in seconds
}

export interface IShortLinkRequestBody {
    urls: IShortLinkRequest[]
}
