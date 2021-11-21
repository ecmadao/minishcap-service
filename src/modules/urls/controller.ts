import { IController } from '../../utils/interfaces/iservice'

export const generateShortLinks: IController = async (ctx) => {
    ctx.body = {
        success: true,
    }
}
