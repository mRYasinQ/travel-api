import { z } from 'zod';

import { emailSchema, passwordSchema } from '../../common/validation/user';

const otpSchema = z.number();

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  otp: otpSchema,
});

const recoverSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  otp: otpSchema,
});

const sendOtpSchema = z.object({
  email: emailSchema,
});

const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

type Login = z.infer<typeof loginSchema>;
type Register = z.infer<typeof registerSchema>;
type Recover = z.infer<typeof recoverSchema>;
type SendOtp = z.infer<typeof sendOtpSchema>;
type VerifyOtp = z.infer<typeof verifyOtpSchema>;

export {
  loginSchema,
  registerSchema,
  recoverSchema,
  sendOtpSchema,
  verifyOtpSchema,
  Login,
  Register,
  Recover,
  SendOtp,
  VerifyOtp,
};
