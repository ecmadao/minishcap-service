/* eslint max-classes-per-file: 0 */ // --> OFF

class CustomError extends Error {
    origin: Error

    constructor(message?: string | Error) {
        if (message instanceof Error) {
            super(message.message)
            this.origin = message
        } else {
            super(message)
        }
    }
}

  interface IError {
      name: string
      code: number
  }

export const ERRORS: { [key: string]: IError } = {
    // customer
    ParameterError: {
        name: 'PARAMETER_ERROR',
        code: 400,
    },
    // Service
    SystemError: {
        name: 'SYSTEM_ERROR',
        code: 500,
    },
    ServiceUnknownError: {
        name: 'SERVICE_ERROR',
        code: 500,
    },
    ServiceTimeoutError: {
        name: 'SERVICE_ERROR',
        code: 500,
    },
    NotFoundError: {
        name: '404_ERROR',
        code: 404,
    },
    UnhandleError: {
        name: 'UNHANDLE_ERROR',
        code: 500,
    },
    DBError: {
        name: 'DB_ERROR',
        code: 500,
    },
}

/**
   * @private
   * @param {String} errName subclass name of error
   * @param {String} errorCode, error code for end-user,
   */
const createError = (errName: string) => {
    const error: IError = ERRORS[errName]
    class NewError extends CustomError {
          errName: string

          extra?: any

          errorCode: number

          constructor(message, options: {
              extra?: any
          } = {}) {
              super(message)
              this.extra = options.extra
              this.errName = error.name
              this.errorCode = error.code
          }
    }

    return NewError
}

const attributeHandler = {
    get(_, errName: string) {
        if (!ERRORS[errName]) return Error
        return createError(errName)
    },
}

function target() {}
export default new Proxy(target, attributeHandler)
