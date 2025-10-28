const AuthMessage = Object.freeze({
  REGISTER_SUCCESS: 'Registered successfully.',
  RECOVER_SUCCESS: 'Recovered successfully.',
  EMAIL_ALREADY_ASSOCIATED: 'This email is already associated with an account.',
  SENT_OTP: 'Otp sent successfully.',
  VERIFIED_OTP: 'Otp verified successfully.',
  WAIT_BEFORE_NEW_OTP: 'You must wait :time seconds before requesting a new OTP.',
  OTP_ALREADY_VERIFIED: 'Otp already verified.',
  INVALID_OTP: 'Invalid otp.',
  EMAIL_INCORRECT: 'Email incorrect.',
});

export default AuthMessage;
