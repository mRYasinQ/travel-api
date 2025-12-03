const ExceptionMessage = Object.freeze({
  NOT_FOUND: 'Cannot :method :route',
  SERVICE_UNAVAILABLE: 'Request timeout.',
  INTERNAL_SERVER: 'Internal Server Error.',
  FILE_LARGE: 'File is large.',
  UNEXPECTED_FILE: 'Too many files or invalid field.',
  FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',
});

export default ExceptionMessage;
