const ExceptionMessage = Object.freeze({
  NOT_FOUND: 'مسیر وجود ندارد.',
  SERVICE_UNAVAILABLE: 'سرویس در دسترس نیست، لطفا دقایقی دیگر تلاش کنید.',
  INTERNAL_SERVER: 'مشکلی پیش آمد، لطفا دوباره تلاش کنید.',
  FILE_LARGE: 'حجم فایل ارسالی بیش از حد مجاز است.',
  UNEXPECTED_FILE: 'تعداد فایل‌های ارسالی نامعتبر یا فایل غیرمنتظره است.',
  FILE_UPLOAD_FAILED: 'مشکلی در بارگذاری فایل وجود داشت، لطفا دوباره تلاش کنید.',
});

export default ExceptionMessage;
