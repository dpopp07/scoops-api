import { APIError } from './api-error';

export class NotFoundError extends APIError {
  readonly statusCode: number = 404;
  readonly message: string;

  constructor(message = 'Not Found') {
    super(message);

    this.message = message;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  asModel() {
    return { message: this.message };
  }
}
