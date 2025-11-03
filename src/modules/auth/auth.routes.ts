import { Router } from 'express';

import { validationBody } from '../../middlewares/validation.middleware';

import {
  loginHandler,
  recoverHandler,
  recoverSendOtpHandler,
  recoverVerifyOtpHandler,
  registerHandler,
  registerSendOtpHandler,
  registerVerifyOtpHandler,
} from './auth.controlller';
import { loginSchema, recoverSchema, registerSchema, sendOtpSchema, verifyOtpSchema } from './auth.schema';

const authRouter = Router();

authRouter.post('/login', validationBody(loginSchema), loginHandler);

authRouter.post('/register', validationBody(registerSchema), registerHandler);
authRouter.post('/register/send-otp', validationBody(sendOtpSchema), registerSendOtpHandler);
authRouter.post('/register/verify-otp', validationBody(verifyOtpSchema), registerVerifyOtpHandler);

authRouter.post('/recover', validationBody(recoverSchema), recoverHandler);
authRouter.post('/recover/send-otp', validationBody(sendOtpSchema), recoverSendOtpHandler);
authRouter.post('/recover/verify-otp', validationBody(verifyOtpSchema), recoverVerifyOtpHandler);

export default authRouter;
