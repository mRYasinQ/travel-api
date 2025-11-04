const AuthMessage = Object.freeze({
  LOGIN_SUCCESS: 'Logged in successfully.',
  REGISTER_SUCCESS: 'Registered successfully.',
  RECOVER_SUCCESS: 'Recovered successfully.',
  SENT_OTP: 'Otp sent successfully.',
  VERIFIED_OTP: 'Otp verified successfully.',
  OTP_ALREADY_VERIFIED: 'Otp already verified.',
  EMAIL_ALREADY_ASSOCIATED: 'This email is already associated with an account.',
  INVALID_OTP: 'Invalid otp.',
  EMAIL_INCORRECT: 'Email incorrect.',
  CREDENTIALS_INCORRECT: 'Email or password incorrect.',
  USER_INACTIVE: 'User inactive.',
  AUTHENTICATION_REQUIRED: 'Access denied. Authentication is required.',
  WAIT_BEFORE_NEW_OTP: 'You must wait :time seconds before requesting a new OTP.',
});

export default AuthMessage;
