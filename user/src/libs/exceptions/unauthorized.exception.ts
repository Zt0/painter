import {HttpStatus} from '@nestjs/common'
import {DefaultHttpException} from './http.exception'

export class UnauthorizedException extends DefaultHttpException {
  constructor(message: string) {
    super({
      message: message,
      statusCode: HttpStatus.UNAUTHORIZED,
      code: 'unauthorized',
    })
  }
}
