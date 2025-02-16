
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log("dasfasfsadfasd")
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // const status = exception.getStatus();
    console.log(exception.message, exception, 'jwt expired')
    if (['jwt expired', 'jwt malformed'].includes(exception.message)) {
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
        statusCode: 'status',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
