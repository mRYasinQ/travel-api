import { Router } from 'express';

import { validationBody } from '../../middlewares/validation.middleware';

import { registerHandler, registerSendOtpHandler, registerVerifyOtpHandler } from './auth.controlller';
import { registerSchema, sendOtpSchema, verifyOtpSchema } from './auth.schema';

const authRouter = Router();

authRouter.post('/register', validationBody(registerSchema), registerHandler);
authRouter.post('/register/send-otp', validationBody(sendOtpSchema), registerSendOtpHandler);
authRouter.post('/register/verify-otp', validationBody(verifyOtpSchema), registerVerifyOtpHandler);

export default authRouter;
