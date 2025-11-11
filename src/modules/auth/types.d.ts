type RegisterOtpKey = `register:otp:${string}`;
type RecoverOtpKey = `recover:otp:${string}`;

interface OtpData {
  otp: string;
  verified: boolean;
}

export { OtpData, RegisterOtpKey, RecoverOtpKey };
