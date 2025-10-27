import { z } from 'zod';

import { emailSchema, passwordSchema } from '../../common/validation/user';

const otpSchema = z.number();

const registerSchema = z.object({
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

export { registerSchema, sendOtpSchema, verifyOtpSchema };

export type Register = z.infer<typeof registerSchema>;
export type SendOtp = z.infer<typeof sendOtpSchema>;
export type VerifyOtp = z.infer<typeof verifyOtpSchema>;
