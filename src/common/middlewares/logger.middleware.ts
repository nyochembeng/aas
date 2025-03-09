import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.headers['user-agent'] || 'Unknown User Agent';
    const start = Date.now();

    // Capture response status code when the response finishes
    res.on('finish', () => {
      const statusCode = res.statusCode;
      const duration = Date.now() - start;

      console.log(
        `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} - ${userAgent} - ${duration}ms`,
      );
    });

    next(); // Proceed to the next middleware or controller
  }
}
