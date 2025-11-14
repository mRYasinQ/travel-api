import type { RequestHandler } from 'express';

import CommonMessage from '../../common/constants/Message';
import createResponse from '../../common/helpers/createResponse';
import AppError from '../../common/utils/AppError';

import AuthMessage from './auth.message';
import type { Login, Recover, Register, SendOtp, VerifyOtp } from './auth.schema';
import {
  loginUser,
  logoutUser,
  recoverSendOtp,
  recoverUser,
  recoverVerifyOtp,
  registerSendOtp,
  registerUser,
  registerVerifyOtp,
} from './auth.service';

const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody as Login;

    const browser = req.userAgent?.browser.name ?? 'unknown';
    const os = req.userAgent?.os.name ?? 'unknown';

    const token = await loginUser(email, password, browser, os);

    return createResponse(res, 'OK', AuthMessage.LOGIN_SUCCESS, { email, token });
  } catch (error) {
    return next(error);
  }
};

const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, otp } = req.validatedBody as Register;

    await registerUser(email, password, otp);

    return createResponse(res, 'CREATED', AuthMessage.REGISTER_SUCCESS, { email });
  } catch (error) {
    return next(error);
  }
};

const registerSendOtpHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.validatedBody as SendOtp;

    await registerSendOtp(email);

    return createResponse(res, 'OK', AuthMessage.SENT_OTP, { email });
  } catch (error) {
    return next(error);
  }
};

const registerVerifyOtpHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.validatedBody as VerifyOtp;

    await registerVerifyOtp(email, otp);

    return createResponse(res, 'OK', AuthMessage.VERIFIED_OTP, { email, is_verified: true });
  } catch (error) {
    return next(error);
  }
};

const recoverHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, otp } = req.validatedBody as Recover;

    await recoverUser(email, password, otp);

    return createResponse(res, 'OK', AuthMessage.RECOVER_SUCCESS, { email });
  } catch (error) {
    return next(error);
  }
};

const recoverSendOtpHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.validatedBody as SendOtp;

    await recoverSendOtp(email);

    return createResponse(res, 'OK', AuthMessage.SENT_OTP, { email });
  } catch (error) {
    return next(error);
  }
};

const recoverVerifyOtpHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.validatedBody as VerifyOtp;

    await recoverVerifyOtp(email, otp);

    return createResponse(res, 'OK', AuthMessage.VERIFIED_OTP, { email, is_verified: true });
  } catch (error) {
    return next(error);
  }
};

const logoutHandler: RequestHandler = async (req, res, next) => {
  try {
    const activeSessionId = req.user?.activeSession.id;
    if (!activeSessionId) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

    await logoutUser(activeSessionId);

    return createResponse(res, 'OK', AuthMessage.LOGOUT_SUCCESS);
  } catch (error) {
    return next(error);
  }
};

export {
  loginHandler,
  registerHandler,
  registerSendOtpHandler,
  registerVerifyOtpHandler,
  recoverHandler,
  recoverSendOtpHandler,
  recoverVerifyOtpHandler,
  logoutHandler,
};
