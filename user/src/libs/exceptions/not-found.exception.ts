import {HttpStatus} from '@nestjs/common'
import {DefaultHttpException} from './http.exception'

export class NotFoundException extends DefaultHttpException {
  constructor(message: string) {
    super({
      message: message,
      statusCode: HttpStatus.NOT_FOUND,
      code: 'not_found',
    })
  }
}
