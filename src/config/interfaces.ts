interface ILogger {
    readonly appenders: {
      readonly consoleLog: {
        readonly type: string
      }
    }
    readonly categories: {
      readonly default: {
        readonly appenders: string[],
        readonly level: string
      }
    }
}

export interface IRedis {
    host: string
    port: number
    db: number
    password?: string
    keyPrefix?: string
}

interface IStorage {
    readonly mongo: {
      url: string
      dbName: string
    }
    readonly redis: IRedis
}

export interface IConfig {
    // Service port
    readonly port: number
    // Service name
    readonly appName: string
    // The host for your application
    readonly host: string
    readonly storage: IStorage
    readonly logger: ILogger
}
