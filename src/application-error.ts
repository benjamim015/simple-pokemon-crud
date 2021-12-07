export enum HTTP {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

export class HttpError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}
