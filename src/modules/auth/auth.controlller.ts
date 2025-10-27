import type { RequestHandler } from 'express';

import HttpStatusCode from '../../common/constants/HttpStatusCode';
import createResponse from '../../common/utils/createResponse';

import AuthMessage from './auth.message';
import type { Register, SendOtp, VerifyOtp } from './auth.schema';
import { registerSendOtp, registerUser, registerVerifyOtp } from './auth.service';

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

export { registerHandler, registerSendOtpHandler, registerVerifyOtpHandler };
