export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;

  constructor(
    success: boolean,
    statusCode: number,
    data?: T,
    error?: string,
    message?: string
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;
    this.message = message;
  }

  static success<T>(data: T, message?: string, statusCode = 200): ApiResponse<T> {
    return new ApiResponse(true, statusCode, data, undefined, message);
  }

  static error(
    error: string,
    statusCode = 500,
    message?: string
  ): ApiResponse<null> {
    return new ApiResponse(false, statusCode, undefined, error, message);
  }
}

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 500, code = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
