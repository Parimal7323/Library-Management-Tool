import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const timestamp = new Date().toISOString();
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    const startTime = Date.now();

    // Log request details
    this.logger.log(
      `${method} ${originalUrl} - ${timestamp} - IP: ${ip} - User-Agent: ${userAgent}`
    );

    // Log response details using response finish event
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      this.logger.log(
        `${method} ${originalUrl} - ${res.statusCode} - ${responseTime}ms`
      );
    });

    next();
  }
}
