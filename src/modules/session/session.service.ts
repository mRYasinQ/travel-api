import { and, eq, ne } from 'drizzle-orm';

import db from '../../configs/db.config';

import AppError from '../../common/utils/AppError';

import sessionEntity from './session.entity';
import SessionMessage from './session.message';

const getSessions = async (userId: number) => {
  const sessions = await db.query.session.findMany({
    where: eq(sessionEntity.userId, userId),
    columns: { token: false, userId: false },
  });

  return sessions;
};

const getSession = async (id: number, userId: number) => {
  const session = await db.query.session.findFirst({
    where: and(eq(sessionEntity.id, id), eq(sessionEntity.userId, userId)),
    columns: { token: false, userId: false },
  });
  if (!session) throw new AppError(SessionMessage.NOT_FOUND, 'NOT_FOUND');

  return session;
};

const deleteSession = async (id: number, userId: number) => {
  const [{ affectedRows }] = await db
    .delete(sessionEntity)
    .where(and(eq(sessionEntity.id, id), eq(sessionEntity.userId, userId)));
  if (affectedRows === 0) throw new AppError(SessionMessage.NOT_FOUND, 'NOT_FOUND');

  return;
};

const clearSessions = async (userId: number, activeSessionId: number, clearActive?: boolean) => {
  const conditions = [eq(sessionEntity.userId, userId)];
  if (!clearActive) conditions.push(ne(sessionEntity.id, activeSessionId));

  await db.delete(sessionEntity).where(and(...conditions));

  return;
};

export { getSessions, getSession, deleteSession, clearSessions };
