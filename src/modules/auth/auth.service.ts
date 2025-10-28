import { eq } from 'drizzle-orm';
import ms from 'ms';

import db from '../../configs/db.config';
import redisClient from '../../configs/redis.config';

import HttpStatusCode from '../../common/constants/HttpStatusCode';
import AppeError from '../../common/utils/AppError';
import formatMessage from '../../common/utils/formatMessage';
import { hashPassword } from '../../common/utils/password';
import { generateOtp } from '../../common/utils/random';
import { sendMailSync } from '../../common/utils/sendMail';

import userEntity from '../user/user.entity';

import AuthMessage from './auth.message';
import type { OtpData, RecoverOtpKey, RegisterOtpKey } from './types';

const { OTP_EXPIRE, OTP_CACHE } = process.env;

const checkUserExist = async (email: string) => {
  const userExist = await db.query.user.findFirst({ where: eq(userEntity.email, email), columns: { id: true } });
  return Boolean(userExist);
};

const registerUser = async (email: string, password: string, otp: number) => {
  const key: RegisterOtpKey = `register:otp:${email}`;

  const otpResult = await redisClient.get(key);
  if (!otpResult) throw new AppeError(AuthMessage.INVALID_OTP, HttpStatusCode.BAD_REQUEST);

  const otpData: OtpData = JSON.parse(otpResult);
  if (otpData.otp !== otp || !otpData.verified) {
    throw new AppeError(AuthMessage.INVALID_OTP, HttpStatusCode.BAD_REQUEST);
  }

  await redisClient.del(key);

  const userExist = await checkUserExist(email);
  if (userExist) throw new AppeError(AuthMessage.EMAIL_ALREADY_ASSOCIATED, HttpStatusCode.BAD_REQUEST);

  const username = email.split('@')[0];
  const hashedPassword = await hashPassword(password);

  await db.insert(userEntity).values({ email, password: hashedPassword, username, isEmailVerified: true });

  return;
};

const registerSendOtp = async (email: string) => {
  const user = await checkUserExist(email);
  if (user) throw new AppeError(AuthMessage.EMAIL_ALREADY_ASSOCIATED, HttpStatusCode.BAD_REQUEST);

  const key: RegisterOtpKey = `register:otp:${email}`;

  const [otpData, ttl] = await redisClient.multi().get(key).ttl(key).execTyped();
  if (otpData && ttl > 0) {
    const { verified }: OtpData = JSON.parse(otpData);

    if (!verified) {
      throw new AppeError(
        formatMessage(AuthMessage.WAIT_BEFORE_NEW_OTP, { time: ttl }),
        HttpStatusCode.TOO_MANY_REQUESTS,
      );
    }
  }

  const otp = generateOtp();
  const value = JSON.stringify({ otp, verified: false });
  const expiresIn = ms(OTP_EXPIRE);

  await redisClient.set(key, value, { expiration: { type: 'PX', value: expiresIn } });

  sendMailSync({
    to: email,
    subject: 'Code for registration',
    text: `Your code for registration is ${otp}`,
  });

  return;
};

const registerVerifyOtp = async (email: string, otp: number) => {
  const key: RegisterOtpKey = `register:otp:${email}`;

  const result = await redisClient.get(key);
  if (!result) throw new AppeError(AuthMessage.INVALID_OTP, HttpStatusCode.BAD_REQUEST);

  const otpData: OtpData = JSON.parse(result);
  if (otpData.verified) throw new AppeError(AuthMessage.OTP_ALREADY_VERIFIED, HttpStatusCode.BAD_REQUEST);
  if (otpData.otp !== otp) throw new AppeError(AuthMessage.INVALID_OTP, HttpStatusCode.BAD_REQUEST);

  const value = JSON.stringify({ otp, verified: true });
  const expiresIn = ms(OTP_CACHE);

  await redisClient.set(key, value, { expiration: { type: 'PX', value: expiresIn } });

  return;
};

const recoverUser = async (email: string, password: string, otp: number) => {
  const key: RecoverOtpKey = `recover:otp:${email}`;

  const otpResult = await redisClient.get(key);
  if (!otpResult) throw new AppeError(AuthMessage.INVALID_OTP, HttpStatusCode.BAD_REQUEST);

  const otpData: OtpData = JSON.parse(otpResult);
  if (otpData.otp !== otp || !otpData.verified) {
    throw new AppeError(AuthMessage.INVALID_OTP, HttpStatusCode.BAD_REQUEST);
  }

  await redisClient.del(key);

  const hashedPassword = await hashPassword(password);
  await db
    .update(userEntity)
    .set({ password: hashedPassword, isEmailVerified: true })
    .where(eq(userEntity.email, email));

  return;
};

const recoverSendOtp = async (email: string) => {
  const user = await checkUserExist(email);
  if (!user) throw new AppeError(AuthMessage.EMAIL_INCORRECT, HttpStatusCode.NOT_FOUND);

  const key: RecoverOtpKey = `recover:otp:${email}`;

  const [otpData, ttl] = await redisClient.multi().get(key).ttl(key).execTyped();
  if (otpData && ttl > 0) {
    const { verified }: OtpData = JSON.parse(otpData);

    if (!verified) {
      throw new AppeError(
        formatMessage(AuthMessage.WAIT_BEFORE_NEW_OTP, { time: ttl }),
        HttpStatusCode.TOO_MANY_REQUESTS,
      );
    }
  }

  const otp = generateOtp();
  const value = JSON.stringify({ otp, verified: false });
  const expiresIn = ms(OTP_EXPIRE);

  await redisClient.set(key, value, { expiration: { type: 'PX', value: expiresIn } });

  sendMailSync({
    to: email,
    subject: 'Code for recovery',
    text: `Your code for recovery is ${otp}`,
  });

  return;
};

const recoverVerifyOtp = async (email: string, otp: number) => {
  const key: RecoverOtpKey = `recover:otp:${email}`;

  const result = await redisClient.get(key);
  if (!result) throw new AppeError(AuthMessage.INVALID_OTP, HttpStatusCode.BAD_REQUEST);

  const otpData: OtpData = JSON.parse(result);
  if (otpData.verified) throw new AppeError(AuthMessage.OTP_ALREADY_VERIFIED, HttpStatusCode.BAD_REQUEST);
  if (otpData.otp !== otp) throw new AppeError(AuthMessage.INVALID_OTP, HttpStatusCode.BAD_REQUEST);

  const value = JSON.stringify({ otp, verified: true });
  const expiresIn = ms(OTP_CACHE);

  await redisClient.set(key, value, { expiration: { type: 'PX', value: expiresIn } });

  return;
};

export { registerUser, registerSendOtp, registerVerifyOtp, recoverUser, recoverSendOtp, recoverVerifyOtp };
