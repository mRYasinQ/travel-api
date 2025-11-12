import type { StringValue } from 'ms';
import type { IResult } from 'ua-parser-js';

import sessionEntity from '../modules/session/session.entity';
import userEntity from '../modules/user/user.entity';

type Session = Pick<typeof sessionEntity.$inferSelect, 'id' | 'token'>;
type User = Omit<typeof userEntity.$inferSelect, 'password'> & { activeSession: Session };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      APP_PORT: string;
      BASE_URL: string;

      REDIS_URL: string;

      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_CONNECTION_LIMIT: string;
      DB_CACHE_QUERY_DEFAULT: StringValue;

      MAIL_SECURE: '0' | '1';
      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_USER: string;
      MAIL_PASSWORD: string;

      TOKEN_EXPIRE: StringValue;
      OTP_EXPIRE: StringValue;
      OTP_CACHE: StringValue;
      REQUEST_TIMEOUT: string;
    }
  }

  namespace Express {
    interface Request {
      validatedBody: unknown;
      validatedQuery: unknown;
      validatedParams: unknown;

      user?: User;
      userAgent?: IResult;
    }
  }
}

export {};
