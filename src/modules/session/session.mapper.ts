import sessionEntity from './session.entity';

type SessionData = Omit<typeof sessionEntity.$inferSelect, 'userId' | 'token'>;

const toSessionResponse = ({ id, browser, os, createdAt, expireAt }: SessionData, activeSessionId: number) => {
  return {
    id,
    browser,
    os,
    created_at: createdAt,
    expire_at: expireAt,
    is_active: id === activeSessionId,
  };
};

const toSessionsResponse = (sessions: SessionData[], activeSessionId: number) => {
  return sessions.map((session) => toSessionResponse(session, activeSessionId));
};

export { toSessionResponse, toSessionsResponse };
