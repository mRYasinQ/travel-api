import type { RequestHandler } from 'express';

import CommonMessage from '../../common/constants/Message';
import AppError from '../../common/utils/AppError';
import createResponse from '../../common/utils/createResponse';

import { toSessionResponse, toSessionsResponse } from './session.mapper';
import SessionMessage from './session.message';
import type { SessionParam } from './session.schema';
import { clearSessions, deleteSession, getSession, getSessions } from './session.service';

const getSessionsHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

    const sessions = await getSessions(userId);

    return createResponse(res, 'OK', SessionMessage.SESSIONS_RETRIEVED, toSessionsResponse(sessions));
  } catch (error) {
    return next(error);
  }
};

const getSessionHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

    const { id } = req.validatedParams as SessionParam;

    const session = await getSession(id, userId);

    return createResponse(res, 'OK', SessionMessage.SESSION_RETRIEVED, toSessionResponse(session));
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

    await clearSessions(user.id, user.activeSession.id);

    return createResponse(res, 'OK', SessionMessage.SESSIONS_CLEARED);
  } catch (error) {
    return next(error);
  }
};

export { getSessionsHandler, getSessionHandler, deleteSessionHandler, clearSessionsHandler };
