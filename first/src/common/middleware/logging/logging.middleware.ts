import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: () => void) {
    console.time('Request-response time');
    console.log('🚀 ~ LoggingMiddleware ~ use ~ Hi there!!');

    res.on('finish', () => console.timeEnd('Request-response time'));

    next();
  }
}
