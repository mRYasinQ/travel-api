import type { RequestHandler } from 'express';

import HttpStatusCode from '../../common/constants/HttpStatusCode';
import createResponse from '../../common/utils/createResponse';

import AuthMessage from './auth.message';
import type { Login, Recover, Register, SendOtp, VerifyOtp } from './auth.schema';
import {
  loginUser,
  recoverSendOtp,
  recoverUser,
  recoverVerifyOtp,
  registerSendOtp,
  registerUser,
  registerVerifyOtp,
} from './auth.service';

const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as Login;

    const browser = req.userAgent?.browser.name ?? 'unknown';
    const os = req.userAgent?.os.name ?? 'unknown';

    const token = await loginUser(email, password, browser, os);

    return createResponse(res, HttpStatusCode.OK, AuthMessage.LOGIN_SUCCESS, { email, token });
  } catch (error) {
    return next(error);
  }
};

const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body as Register;

    await registerUser(email, password, otp);

    return createResponse(res, HttpStatusCode.CREATED, AuthMessage.REGISTER_SUCCESS, { email });
  } catch (error) {
    return next(error);
  }
};

const registerSendOtpHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body as SendOtp;

    await registerSendOtp(email);

    return createResponse(res, HttpStatusCode.OK, AuthMessage.SENT_OTP, { email });
  } catch (error) {
    return next(error);
  }
};

const registerVerifyOtpHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body as VerifyOtp;

    await registerVerifyOtp(email, otp);

    return createResponse(res, HttpStatusCode.OK, AuthMessage.VERIFIED_OTP, { email, is_verified: true });
  } catch (error) {
    return next(error);
  }
};

const recoverHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body as Recover;

    await recoverUser(email, password, otp);

    return createResponse(res, HttpStatusCode.OK, AuthMessage.RECOVER_SUCCESS, { email });
  } catch (error) {
    return next(error);
  }
};

const recoverSendOtpHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body as SendOtp;

    await recoverSendOtp(email);

    return createResponse(res, HttpStatusCode.OK, AuthMessage.SENT_OTP, { email });
  } catch (error) {
    return next(error);
  }
};

const recoverVerifyOtpHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body as VerifyOtp;

    await recoverVerifyOtp(email, otp);

    return createResponse(res, HttpStatusCode.OK, AuthMessage.VERIFIED_OTP, { email, is_verified: true });
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
};
