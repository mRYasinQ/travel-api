import { eq } from 'drizzle-orm';
import ms from 'ms';

import db from '../../configs/db.config';
import redisClient from '../../configs/redis.config';

import CommonMessage from '../../common/constants/Message';
import formatMessage from '../../common/helpers/formatMessage';
import { comparePassword, hashPassword } from '../../common/helpers/password';
import { execAndExtract } from '../../common/helpers/redis';
import { sendMailSync } from '../../common/helpers/sendMail';
import AppError from '../../common/utils/AppError';
import { generateOtp, generateToken } from '../../common/utils/random';

import sessionEntity from '../session/session.entity';
import userEntity from '../user/user.entity';

import AuthMessage from './auth.message';

type RegisterOtpKey = `register:otp:${string}`;
type RecoverOtpKey = `recover:otp:${string}`;
type OtpData = {
  otp: string;
  verified: boolean;
};

const { TOKEN_EXPIRE, OTP_EXPIRE, OTP_CACHE } = process.env;

const checkUserExist = async (email: string) => {
  const userExist = await db.query.user.findFirst({ where: eq(userEntity.email, email), columns: { id: true } });
  return Boolean(userExist);
};

const loginUser = async (email: string, password: string, browser: string, os: string) => {
  const user = await db.query.user.findFirst({
    where: eq(userEntity.email, email),
    columns: { id: true, password: true, isActive: true },
  });
  if (!user) throw new AppError(AuthMessage.CREDENTIALS_INCORRECT, 'BAD_REQUEST');

  const { password: hashedPassword, isActive } = user;

  const isPasswordValid = await comparePassword(password, hashedPassword);
  if (!isPasswordValid) throw new AppError(AuthMessage.CREDENTIALS_INCORRECT, 'BAD_REQUEST');

  if (!isActive) throw new AppError(CommonMessage.USER_INACTIVE, 'FORBIDDEN');

  const token = generateToken();
  const tokenExpire = Date.now() + ms(TOKEN_EXPIRE);
  const tokenExpireDate = new Date(tokenExpire);

  await db.insert(sessionEntity).values({
    userId: user.id,
    token,
    browser,
    os,
    expireAt: tokenExpireDate,
  });

  return token;
};

const registerUser = async (email: string, password: string, otp: string) => {
  const key: RegisterOtpKey = `register:otp:${email}`;
  const otpResult = await redisClient.get(key);
  if (!otpResult) throw new AppError(AuthMessage.INVALID_OTP, 'BAD_REQUEST');

  const otpData: OtpData = JSON.parse(otpResult);
  if (otpData.otp !== otp || !otpData.verified) {
    throw new AppError(AuthMessage.INVALID_OTP, 'BAD_REQUEST');
  }

  await redisClient.del(key);

  const userExist = await checkUserExist(email);
  if (userExist) throw new AppError(AuthMessage.EMAIL_ALREADY_ASSOCIATED, 'BAD_REQUEST');

  const hashedPassword = await hashPassword(password);

  await db.insert(userEntity).values({ email, password: hashedPassword, isEmailVerified: true });

  return;
};

const registerSendOtp = async (email: string) => {
  const user = await checkUserExist(email);
  if (user) throw new AppError(AuthMessage.EMAIL_ALREADY_ASSOCIATED, 'BAD_REQUEST');

  const key: RegisterOtpKey = `register:otp:${email}`;
  const [otpData, ttl] = await execAndExtract<[string, number]>(redisClient.multi().get(key).ttl(key));
  if (otpData && ttl > 0) {
    const { verified }: OtpData = JSON.parse(otpData);

    if (!verified) {
      throw new AppError(formatMessage(AuthMessage.WAIT_BEFORE_NEW_OTP, { time: ttl }), 'TOO_MANY_REQUESTS');
    }
  }

  const otp = String(generateOtp());
  const value = JSON.stringify({ otp, verified: false });
  const expiresIn = ms(OTP_EXPIRE);

  await redisClient.set(key, value, 'PX', expiresIn);

  sendMailSync({
    to: email,
    subject: 'Code for registration',
    text: `Your code for registration is ${otp}`,
  });

  return;
};

const registerVerifyOtp = async (email: string, otp: string) => {
  const key: RegisterOtpKey = `register:otp:${email}`;

  const result = await redisClient.get(key);
  if (!result) throw new AppError(AuthMessage.INVALID_OTP, 'BAD_REQUEST');

  const otpData: OtpData = JSON.parse(result);
  if (otpData.verified) throw new AppError(AuthMessage.OTP_ALREADY_VERIFIED, 'BAD_REQUEST');
  if (otpData.otp !== otp) throw new AppError(AuthMessage.INVALID_OTP, 'BAD_REQUEST');

  const value = JSON.stringify({ otp, verified: true });
  const expiresIn = ms(OTP_CACHE);

  await redisClient.set(key, value, 'PX', expiresIn);

  return;
};

const recoverUser = async (email: string, password: string, otp: string) => {
  const key: RecoverOtpKey = `recover:otp:${email}`;
  const otpResult = await redisClient.get(key);
  if (!otpResult) throw new AppError(AuthMessage.INVALID_OTP, 'BAD_REQUEST');

  const otpData: OtpData = JSON.parse(otpResult);
  if (otpData.otp !== otp || !otpData.verified) throw new AppError(AuthMessage.INVALID_OTP, 'BAD_REQUEST');

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
  if (!user) throw new AppError(AuthMessage.EMAIL_INCORRECT, 'BAD_REQUEST');

  const key: RecoverOtpKey = `recover:otp:${email}`;
  const [otpData, ttl] = await execAndExtract<[string, number]>(redisClient.multi().get(key).ttl(key));
  if (otpData && ttl > 0) {
    const { verified }: OtpData = JSON.parse(otpData);

    if (!verified) {
      throw new AppError(formatMessage(AuthMessage.WAIT_BEFORE_NEW_OTP, { time: ttl }), 'TOO_MANY_REQUESTS');
    }
  }

  const otp = String(generateOtp());
  const value = JSON.stringify({ otp, verified: false });
  const expiresIn = ms(OTP_EXPIRE);

  await redisClient.set(key, value, 'PX', expiresIn);

  sendMailSync({
    to: email,
    subject: 'Code for recovery',
    text: `Your code for recovery is ${otp}`,
  });

  return;
};

const recoverVerifyOtp = async (email: string, otp: string) => {
  const key: RecoverOtpKey = `recover:otp:${email}`;

  const result = await redisClient.get(key);
  if (!result) throw new AppError(AuthMessage.INVALID_OTP, 'BAD_REQUEST');

  const otpData: OtpData = JSON.parse(result);
  if (otpData.verified) throw new AppError(AuthMessage.OTP_ALREADY_VERIFIED, 'BAD_REQUEST');
  if (otpData.otp !== otp) throw new AppError(AuthMessage.INVALID_OTP, 'BAD_REQUEST');

  const value = JSON.stringify({ otp, verified: true });
  const expiresIn = ms(OTP_CACHE);

  await redisClient.set(key, value, 'PX', expiresIn);

  return;
};

const logoutUser = async (sessionId: number) => {
  await db.delete(sessionEntity).where(eq(sessionEntity.id, sessionId));
  return;
};

export {
  loginUser,
  registerUser,
  registerSendOtp,
  registerVerifyOtp,
  recoverUser,
  recoverSendOtp,
  recoverVerifyOtp,
  logoutUser,
};
