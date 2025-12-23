import { z } from 'zod';

import { emailSchema, passwordSchema } from '../../common/validations/user';

const otpSchema = z
  .string('کد تایید باید یک رشته باشد.')
  .min(5, 'کد تایید باید حداقل ۵ کارکتر باشد.')
  .max(5, 'کد تایید می‌تواند حداکثر ۵ کارکتر باشد.');

const baseAuthSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  password: passwordSchema,
});

const loginSchema = baseAuthSchema.omit({ otp: true });

const registerSchema = baseAuthSchema;

const recoverSchema = baseAuthSchema;

const sendOtpSchema = baseAuthSchema.pick({ email: true });

const verifyOtpSchema = baseAuthSchema.omit({ password: true });

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
