import { eq } from 'drizzle-orm';
import type { RequestHandler } from 'express';

import db from '../configs/db.config';

import CommonMessage from '../common/constants/Message';
import AppeError from '../common/utils/AppError';

import sessionEntity from '../modules/session/session.entity';

const checkAuth = (isOptional: boolean = false): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
        throw new AppeError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');
      }

      const userToken = bearerToken.split(' ')[1];
      if (!userToken) throw new AppeError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

      const session = await db.query.session.findFirst({
        where: eq(sessionEntity.token, userToken),
        with: { user: { columns: { password: false } } },
      });
      if (!session) throw new AppeError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

      const { token, browser, os, expireAt, user } = session;

      const browserName = req.userAgent?.browser.name;
      const osName = req.userAgent?.os.name;
      if (browserName !== browser || osName !== os) {
        throw new AppeError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');
      }

      if (expireAt < new Date()) {
        await db.delete(sessionEntity).where(eq(sessionEntity.id, session.id));
        throw new AppeError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');
      }

      if (!user.isActive) throw new AppeError(CommonMessage.USER_INACTIVE, 'FORBIDDEN');

      req.user = user;
      req.activeToken = token;

      return next();
    } catch (error) {
      if (isOptional) return next();
      return next(error);
    }
  };
};

export default checkAuth;
