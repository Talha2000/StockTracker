// A plain Error doesn't carry a status code; errorHandler prefers this over
// guessing from res.statusCode (which defaults to 200 and was the source of
// a real bug — see Middleware/errorHandler.ts).
export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
