import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { validateUserCreation, validateUserUpdate } from '../utils/validation';

export const validateUserCreate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = validateUserCreation(req.body);
  
  if (!validation.isValid) {
    throw new AppError(
      `Validation failed: ${validation.errors.join(', ')}`,
      400
    );
  }

  next();
};

export const validateUserUpdateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = validateUserUpdate(req.body);
  
  if (!validation.isValid) {
    throw new AppError(
      `Validation failed: ${validation.errors.join(', ')}`,
      400
    );
  }

  next();
};

export const validateUUID = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuid || !uuidRegex.test(uuid)) {
      throw new AppError(`Invalid ${paramName} format`, 400);
    }

    next();
  };
};

export const validatePaginationQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, limit, sortBy, sortOrder } = req.query;

  // Validate page
  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    throw new AppError('Page must be a positive number', 400);
  }

  // Validate limit
  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    throw new AppError('Limit must be between 1 and 100', 400);
  }

  // Validate sortBy
  const validSortFields = ['email', 'role', 'status', 'createdAt'];
  if (sortBy && !validSortFields.includes(sortBy as string)) {
    throw new AppError(
      `Invalid sortBy field. Valid fields: ${validSortFields.join(', ')}`,
      400
    );
  }

  // Validate sortOrder
  if (sortOrder && !['asc', 'desc'].includes(sortOrder as string)) {
    throw new AppError('Sort order must be either "asc" or "desc"', 400);
  }

  next();
};
