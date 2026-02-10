
import { Request, Response, NextFunction } from 'express';

// Custom error class so we can throw errors with a status code
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

// This MUST have 4 parameters for Express to recognize it as error middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error in the terminal for debugging
  console.error('');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('  🚨  ERROR');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error(`  📍  Route   : ${req.method} ${req.url}`);
  console.error(`  📝  Message : ${err.message}`);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');

  // If it's our custom AppError, use its status code
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.message,
    });
    return;
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.name === 'MongoServerError' && err.message.includes('duplicate key')) {
    res.status(400).json({
      success: false,
      error: 'A record with that information already exists',
    });
    return;
  }

  // Default: unknown server error
  res.status(500).json({
    success: false,
    error: 'Something went wrong on the server. Please try again later.',
  });
};