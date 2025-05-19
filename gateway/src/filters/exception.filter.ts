import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log('exception', exception);
    if (exception?.getStatus?.() === 429) {
      response
      .status(429)
      .json({
        statusCode: 'Too many requests',
        message: exception.message,
        timestamp: new Date().toISOString(),
    })
    }
    else if (['Invalid credentials', 'jwt expired', 'jwt malformed'].includes(exception.message)) {
        response
      .status(401)
      .json({
        statusCode: 'unauthorized',
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
    else {
    response
      .status(500)
      .json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception?.message,
      });
    }
  }
}
