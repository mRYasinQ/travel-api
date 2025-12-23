const AuthMessage = Object.freeze({
  LOGIN_SUCCESS: 'ورود با موفقیت انجام شد.',
  REGISTER_SUCCESS: 'ثبت‌نام با موفقیت انجام شد.',
  RECOVER_SUCCESS: 'بازنشانی گذرواژه با موفقیت انجام شد.',
  LOGOUT_SUCCESS: 'خروج از حساب کاربری با موفقیت انجام شد.',
  EMAIL_VERIFIED_SUCCESS: 'ایمیل تایید شد.',
  SENT_OTP: 'کد تایید ارسال شد.',
  VERIFIED_OTP: 'کد تایید شد.',
  OTP_ALREADY_VERIFIED: 'این کد قبلا تایید شده است.',
  EMAIL_ALREADY_ASSOCIATED: 'حسابی با این ایمیل ثبت شده است.',
  INVALID_OTP: 'کد تایید معتبر نمی‌باشد.',
  EMAIL_INCORRECT: 'ایمیل نادرست است.',
  EMAIL_VERIFIED: 'ایمیل تایید شده است.',
  CREDENTIALS_INCORRECT: 'ایمیل یا گذرواژه نادرست است.',
  WAIT_BEFORE_NEW_OTP: 'لطفا :time ثانیه دیگر دوباره تلاش کنید.',
});

export default AuthMessage;
