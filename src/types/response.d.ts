import type HttpStatusCode from '../common/constants/HttpStatusCode';

interface BaseResponse {
  status_code: HttpStatusCode;
}

interface SuccessResponse<T> extends BaseResponse {
  data?: T;
  message: string;
}

interface ErrorResponse extends BaseResponse {
  error: ErrorData;
}

interface SuccessData<T> {
  data?: T;
  message: string;
}

interface ErrorData {
  type: string;
  message: string;
}

export { SuccessResponse, ErrorResponse, SuccessData, ErrorData };
