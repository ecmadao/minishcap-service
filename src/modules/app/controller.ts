import { IController } from '../../utils/interfaces/iservice'

export const goHome: IController = async (ctx) => {
    ctx.body = {
        success: true,
    }
}
