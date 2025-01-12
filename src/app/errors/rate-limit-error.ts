import { APIError } from './api-error';

export class RateLimitError extends APIError {
  readonly statusCode: number = 429;
  readonly message: string;

  constructor(
    message = 'Rate Limit Exceeded: Too many requests, please try again later',
  ) {
    super(message);

    this.message = message;

    Object.setPrototypeOf(this, RateLimitError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  asModel() {
    return { message: this.message };
  }
}
