import {HttpStatus} from '@nestjs/common'
import {DefaultHttpException} from './http.exception'

export class InternalServerErrorException extends DefaultHttpException {
  constructor(
    message: string,
    failureReasons = 'internal_server_error',
    title?: string,
  ) {
    super({
      message: message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: failureReasons,
      title: title,
    })
  }
}
