import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err.code === '23505') {
    // Unique constraint violation
    return res.status(409).json({
      success: false,
      error: 'Resource already exists',
      code: 'DUPLICATE_RESOURCE',
      statusCode: 409,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.details,
      statusCode: 400,
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    statusCode: err.statusCode || 500,
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
    statusCode: 404,
  });
};
