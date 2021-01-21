import { ErrorRequestHandler } from 'express';
import { isHttpError } from 'http-errors';

const errorHandler: ErrorRequestHandler = (err, _1, res, _2) => {
  if (isHttpError(err)) {
    const message = err.expose ? err.message : 'Unexpected error has occurred';
    res.status(err.statusCode).json({ message: message});
  } else {
    res.status(500).json({ message: 'Unexpected error has occurred' });
  }
}

export default errorHandler;