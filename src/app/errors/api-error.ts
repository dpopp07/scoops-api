interface ErrorModel {
  message: string;
}

export abstract class APIError extends Error {
  abstract readonly statusCode: number;
  abstract readonly message: string;

  abstract getStatusCode(): number;
  abstract asModel(): ErrorModel;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, APIError.prototype);
  }
}
