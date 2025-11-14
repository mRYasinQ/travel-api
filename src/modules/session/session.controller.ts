import type { RequestHandler } from 'express';

import CommonMessage from '../../common/constants/Message';
import createResponse from '../../common/helpers/createResponse';
import AppError from '../../common/utils/AppError';

import { toSessionResponse, toSessionsResponse } from './session.mapper';
import SessionMessage from './session.message';
import type { ClearSessions, SessionParam } from './session.schema';
import { clearSessions, deleteSession, getSession, getSessions } from './session.service';

const getSessionsHandler: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

    const sessions = await getSessions(user.id);

    return createResponse(
      res,
      'OK',
      SessionMessage.SESSIONS_RETRIEVED,
      toSessionsResponse(sessions, user.activeSession.id),
    );
  } catch (error) {
    return next(error);
  }
};

const getSessionHandler: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

    const { id } = req.validatedParams as SessionParam;

    const session = await getSession(id, user.id);

    return createResponse(
      res,
      'OK',
      SessionMessage.SESSION_RETRIEVED,
      toSessionResponse(session, user.activeSession.id),
    );
  } catch (error) {
    return next(error);
  }
};

const deleteSessionHandler: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

    const { id } = req.validatedParams as SessionParam;

    if (id === user.activeSession.id) throw new AppError(SessionMessage.DELETE_ACTIVE_SESSION, 'CONFLICT');

    await deleteSession(id, user.id);

    return createResponse(res, 'OK', SessionMessage.SESSION_DELETED);
  } catch (error) {
    return next(error);
  }
};

const clearSessionsHandler: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

    const { clear_active } = req.validatedBody as ClearSessions;

    await clearSessions(user.id, user.activeSession.id, clear_active);

    return createResponse(res, 'OK', SessionMessage.SESSIONS_CLEARED);
  } catch (error) {
    return next(error);
  }
};

export { getSessionsHandler, getSessionHandler, deleteSessionHandler, clearSessionsHandler };
