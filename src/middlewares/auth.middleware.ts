import { eq } from 'drizzle-orm';
import type { Request, RequestHandler } from 'express';

import db from '../configs/db.config';

import CommonMessage from '../common/constants/Message';
import type { Permission } from '../common/constants/Permissions';
import AppError from '../common/utils/AppError';

import sessionEntity from '../modules/session/session.entity';

const getUserToken = (req: Request): string | undefined => {
  const bearerToken = req.headers['authorization'];
  if (!bearerToken || !bearerToken.startsWith('Bearer ')) return;

  const userToken = bearerToken.split(' ')[1];
  if (!userToken) return;

  return userToken;
};

const checkAuth = (isOptional: boolean = false): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const userToken = getUserToken(req);
      if (!userToken) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

      const session = await db.query.session.findFirst({
        where: eq(sessionEntity.token, userToken),
        with: {
          user: {
            columns: { password: false },
            with: { role: { columns: { id: true, name: true, permissions: true } } },
          },
        },
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
      if (isOptional && error instanceof AppError) return next();
      return next(error);
    }
  };
};

const checkPermissions = (...permissions: Permission[]): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const userPermissions = req.user?.role?.permissions ?? [];

      const hasAllPermissions = permissions.every((permission) => userPermissions.includes(permission));
      if (!hasAllPermissions) throw new AppError(CommonMessage.ACCESS_DENIED, 'FORBIDDEN');

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

export { checkAuth, checkPermissions };
