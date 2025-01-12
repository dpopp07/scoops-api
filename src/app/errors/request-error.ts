import { APIError } from './api-error';

export class RequestError extends APIError {
  readonly statusCode: number;
  readonly message: string;

  constructor(message = 'Bad Request', statusCode = 400) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, RequestError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  asModel() {
    return { message: this.message };
  }
}
