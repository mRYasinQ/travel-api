import type { StringValue } from 'ms';
import type { IResult } from 'ua-parser-js';

import userEntity from '../modules/user/user.entity';

type User = Omit<typeof userEntity.$inferSelect, 'password'>;

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

      MAIL_SECURE: '0' | '1';
      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_USER: string;
      MAIL_PASSWORD: string;

      TOKEN_EXPIRE: StringValue;
      OTP_EXPIRE: StringValue;
      OTP_CACHE: StringValue;
    }
  }

  namespace Express {
    interface Request {
      user?: User;
      activeToken?: string;
      userAgent?: IResult;
    }
  }
}

export {};
