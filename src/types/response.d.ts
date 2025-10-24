import type HttpStatusCode from '../common/constants/HttpStatusCode';

interface ResponseType<T = unknown> {
  status_code: HttpStatusCode;
  data?: T;
  message?: string;
  error?: string;
}

export { ResponseType };
