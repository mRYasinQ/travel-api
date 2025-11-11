import { eq } from 'drizzle-orm';
import type { RequestHandler } from 'express';

import db from '../configs/db.config';

import CommonMessage from '../common/constants/Message';
import AppError from '../common/utils/AppError';

import sessionEntity from '../modules/session/session.entity';

const checkAuth = (isOptional: boolean = false): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
        throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');
      }

      const userToken = bearerToken.split(' ')[1];
      if (!userToken) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

      const session = await db.query.session.findFirst({
        where: eq(sessionEntity.token, userToken),
        with: { user: { columns: { password: false } } },
      });
      if (!session) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

      const { id, token, browser, os, expireAt, user } = session;

      const browserName = req.userAgent?.browser.name;
      const osName = req.userAgent?.os.name;
      if (browserName !== browser || osName !== os) {
        throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');
      }

      if (expireAt < new Date()) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

      req.user = { ...user, activeSession: { id, token } };

      return next();
    } catch (error) {
      if (isOptional) return next();
      return next(error);
    }
  };
};

export default checkAuth;
