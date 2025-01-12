import { APIError } from './api-error';

export class ValidationError extends APIError {
  readonly statusCode: number;
  readonly message: string;

  constructor(message = 'Invalid Request', statusCode = 400) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  asModel() {
    return { message: this.message };
  }
}
