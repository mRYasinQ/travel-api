type RegisterOtpKey = `register:otp:${string}`;
type RecoverOtpKey = `recover:otp:${string}`;

interface OtpData {
  otp: number;
  verified: boolean;
}

export { OtpData, RegisterOtpKey, RecoverOtpKey };
