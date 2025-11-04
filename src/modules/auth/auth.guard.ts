import { eq } from 'drizzle-orm';
import type { RequestHandler } from 'express';

import db from '../../configs/db.config';

import HttpStatusCode from '../../common/constants/HttpStatusCode';
import AppeError from '../../common/utils/AppError';

import sessionEntity from '../session/session.entity';

import AuthMessage from './auth.message';

const checkAuth = (isOptional: boolean = false): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw new AppeError(AuthMessage.AUTHENTICATION_REQUIRED, HttpStatusCode.UNAUTHORIZED);

      const userToken = bearerToken.split(' ')[1];
      if (!userToken) throw new AppeError(AuthMessage.AUTHENTICATION_REQUIRED, HttpStatusCode.UNAUTHORIZED);

      const session = await db.query.session.findFirst({
        where: eq(sessionEntity.token, userToken),
        with: { user: { columns: { password: false } } },
      });
      if (!session) throw new AppeError(AuthMessage.AUTHENTICATION_REQUIRED, HttpStatusCode.UNAUTHORIZED);

      const { token, browser, os, expireAt, user } = session;

      const browserName = req.userAgent?.browser.name;
      const osName = req.userAgent?.os.name;
      if (browserName !== browser || osName !== os) {
        throw new AppeError(AuthMessage.AUTHENTICATION_REQUIRED, HttpStatusCode.UNAUTHORIZED);
      }

      if (expireAt < new Date()) {
        await db.delete(sessionEntity).where(eq(sessionEntity.id, session.id));
        throw new AppeError(AuthMessage.AUTHENTICATION_REQUIRED, HttpStatusCode.UNAUTHORIZED);
      }

      if (!user.isActive) throw new AppeError(AuthMessage.USER_INACTIVE, HttpStatusCode.FORBIDDEN);

      req.user = user;
      req.activeSession = token;

      return next();
    } catch (error) {
      if (isOptional) return next();
      return next(error);
    }
  };
};

export default checkAuth;
