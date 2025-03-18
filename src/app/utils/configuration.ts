import { envSchema, JSONSchemaType } from 'env-schema';
import { levels } from 'pino';

// TODO: convert this to a class that loads the config asynchronously.

interface Configuration {
  PORT: number;
  JWT_KEY: string;
  DB_NAME: string;
  DB_PORT: number;
  DB_HOST?: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_CERT_FILE?: string;
  LOG_LEVEL: string;
  DEVELOPMENT_LOGGING: boolean;
  CACHE_GET_RESPONSES: boolean;
  NODE_ENV: string;
}

const schema: JSONSchemaType<Configuration> = {
  type: 'object',
  required: ['PORT', 'JWT_KEY', 'DB_NAME', 'DB_PORT', 'LOG_LEVEL'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
    JWT_KEY: {
      type: 'string',
    },
    LOG_LEVEL: {
      type: 'string',
      enum: Object.keys(levels.values),
    },
    DEVELOPMENT_LOGGING: {
      type: 'boolean',
      default: false,
    },
    CACHE_GET_RESPONSES: {
      type: 'boolean',
      default: true,
    },
    DB_NAME: {
      type: 'string',
    },
    DB_PORT: {
      type: 'number',
    },
    DB_HOST: {
      type: 'string',
      nullable: true,
    },
    DB_USERNAME: {
      type: 'string',
      nullable: true,
    },
    DB_PASSWORD: {
      type: 'string',
      nullable: true,
    },
    DB_CERT_FILE: {
      type: 'string',
      nullable: true,
    },
    NODE_ENV: {
      type: 'string',
      enum: ['production', 'development', 'test'],
      default: 'development',
    },
  },
};

export const config = envSchema({
  schema: schema,
  dotenv: true,
});
