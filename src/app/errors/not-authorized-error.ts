import { APIError } from './api-error';

export class NotAuthorizedError extends APIError {
  readonly statusCode: number = 401;
  readonly message: string;

  constructor(message = 'Not Authorized') {
    super(message);

    this.message = message;

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  asModel() {
    return { message: this.message };
  }
}
