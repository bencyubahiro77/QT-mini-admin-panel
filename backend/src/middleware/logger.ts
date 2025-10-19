import { Request, Response, NextFunction } from 'express';
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const reset = '\x1b[0m';

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ` +
      `${statusColor}${res.statusCode}${reset} - ${duration}ms`
    );
  });

  next();
};

export const detailedLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  console.log({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
