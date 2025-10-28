type RegisterOtpKey = `register:otp:${string}`;

interface OtpData {
  otp: number;
  verified: boolean;
}

export { OtpData, RegisterOtpKey };
