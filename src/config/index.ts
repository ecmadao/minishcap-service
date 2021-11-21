import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { IConfig } from './interfaces'
import { configSchema } from './schema'

const loadConfig = (filepath: string): IConfig => {
    if (!/\.yaml$/.test(filepath)) {
        throw new Error('Configuration file should be in YAML format')
    }

    if (!fs.existsSync(filepath)) {
        throw new Error(`Target file ${filepath} not exist!`)
    }

    return yaml.load(
        fs.readFileSync(filepath, 'utf8'),
    ) as IConfig
}

const loadFile = (id: String): IConfig => {
    const filepath = path.resolve(__dirname, `./env/${id}.yaml`)
    return loadConfig(filepath)
}

const generateConfig = (): IConfig => {
    const env = process.env.NODE_ENV || 'base'
    const baseConfig = loadFile('base')
    const envConfig = loadFile(env)
    const config = ({ ...baseConfig, ...envConfig }) as IConfig

    const check = configSchema.validate(config)
    if (check.error) {
        throw check.error
    }

    return config
}

export const config = generateConfig()
