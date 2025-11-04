import type { StringValue } from 'ms';
import type { IResult } from 'ua-parser-js';

import userEntity from '../modules/user/user.entity';

type User = Omit<typeof userEntity.$inferSelect, 'password'>;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';

      APP_PORT: number;
      BASE_URL: string;

      REDIS_URL: string;

      DB_HOST: string;
      DB_PORT: number;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_CONNECTION_LIMIT: number;

      MAIL_SECURE: '0' | '1';
      MAIL_HOST: string;
      MAIL_PORT: number;
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
      activeSession?: string;
      userAgent?: IResult;
    }
  }
}

export {};
