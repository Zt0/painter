import {HttpStatus} from '@nestjs/common'
import {DefaultHttpException} from './http.exception'

export class BadRequestException extends DefaultHttpException {
  constructor(message: string, failureReasons = 'bad_request', title?: string) {
    super({
      message: message,
      statusCode: HttpStatus.BAD_REQUEST,
      code: failureReasons,
      title: title,
    })
  }
}
