import {HttpException} from '@nestjs/common'

export class DefaultHttpException extends HttpException {
  constructor(data: {
    message: string
    statusCode: number
    code: string
    title?: string
  }) {
    super({message: data.message, code: data.code}, data.statusCode)
  }
}
