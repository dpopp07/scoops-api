import { APIError } from './api-error';

export class InternalError extends APIError {
  readonly statusCode: number = 500;
  readonly message: string;

  constructor(message = 'Internal Server Error') {
    super(message);

    this.message = message;

    Object.setPrototypeOf(this, InternalError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  asModel() {
    return { message: this.message };
  }
}
