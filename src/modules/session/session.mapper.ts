import sessionEntity from './session.entity';

type SessionData = Omit<typeof sessionEntity.$inferSelect, 'userId' | 'token'>;

const toSessionResponse = ({ id, browser, os, createdAt, expireAt }: SessionData) => ({
  id,
  browser,
  os,
  created_at: createdAt,
  expire_at: expireAt,
});

const toSessionsResponse = (sessions: SessionData[]) => sessions.map(toSessionResponse);

export { toSessionResponse, toSessionsResponse };
