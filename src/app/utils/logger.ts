import pino, { LoggerOptions } from 'pino';
import { config } from './configuration';

const pinoConfig: LoggerOptions = {
  name: 'scoops',
  level: config.NODE_ENV === 'test' ? 'silent' : config.LOG_LEVEL,
  formatters: {
    bindings: ({ hostname, pid }) => {
      return {
        pid: pid,
        host: hostname,
        node_version: process.version,
      };
    },
    level: (label) => {
      return { severity: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['user.token'],
};

if (config.DEVELOPMENT_LOGGING) {
  pinoConfig.transport = {
    target: 'pino-pretty',
    options: {
      messageFormat:
        '[{severity}] {msg}{if res.statusCode}: {res.statusCode}{end}',
    },
  };
}

const logger = pino(pinoConfig);

interface RootContext {
  layer: 'server' | 'middleware' | 'controller' | 'data' | 'database';
}

interface ResourceOrientedContext extends RootContext {
  resource: 'user' | 'recipe' | 'ingredient';
}

interface FunctionalContext extends RootContext {
  function: string;
  query?: string;
  port?: number;
}

type LoggerContext = ResourceOrientedContext | FunctionalContext;

export function getLogger(context: LoggerContext) {
  return logger.child(context);
}
