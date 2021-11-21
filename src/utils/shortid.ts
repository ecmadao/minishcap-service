import { Redis } from 'ioredis'

const SEED_KEY = 'seed'
const AVAILABLE_IDS = 'availableids'
const CHARS = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~'

const convertTo64String = (num: number): string => {
    let number = Math.abs(num)
    const res: string[] = []

    do {
        const mod = number % (CHARS.length)
        number = (number - mod) / (CHARS.length)
        res.push(CHARS[mod])
    } while (number)

    return res.join('')
}

// TODO: Seed should be initialized while service start
// TODO: We should get increment from env config
export const generateShortId = async (cache: Redis): Promise<string> => {
    /**
     * We can get available from set or list before increase seed.
     * Which means we need to make a schedule service to release expired short ids
     */
    const available = await cache.spop(AVAILABLE_IDS)
    if (available) return available

    const num = await cache.incrby(SEED_KEY, 1)
    return convertTo64String(num)
}
