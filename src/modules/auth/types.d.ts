type RegisterOtpKey = `register:otp:${string}`;

interface OtpData {
  otp: number;
  verified: boolean;
}

export type { OtpData, RegisterOtpKey };
