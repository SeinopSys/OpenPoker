import { Temporal } from '@js-temporal/polyfill';
import { LoggerService } from '@nestjs/common/services/logger.service';
import { RequestHandler } from 'express';
import session from 'express-session';
import { serverEnv } from '../server-env';
import { retrieveSessionSecret } from './retrieve-session-secret';
import { retrieveSessionStore } from './retrieve-session-store';

let middlewareInstance: RequestHandler | undefined;
export const createSessionMiddleware = async (logger: LoggerService) => {
  if (!middlewareInstance)
    middlewareInstance = session({
      secret: (await retrieveSessionSecret(logger)).toString('hex'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: '/',
        httpOnly: true,
        secure: serverEnv.SESSION_COOKIE_SECURE,
        sameSite: true,
        maxAge: Temporal.Duration.from({ days: 7 }).total('millisecond'),
      },
      store: await retrieveSessionStore(logger),
    });
  return middlewareInstance;
};
