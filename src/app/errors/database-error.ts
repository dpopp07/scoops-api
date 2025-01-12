import { APIError } from './api-error';

export class DatabaseError extends APIError {
  readonly statusCode: number = 500;
  readonly message: string;

  constructor() {
    const message = 'Database Error: operation could not be completed';
    super(message);

    this.message = message;

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  asModel() {
    return { message: this.message };
  }
}
