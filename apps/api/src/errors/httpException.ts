export class HttpException extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly error?: string;

  constructor(status: number, message: string, error?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.error = error;
  }
}
