import {
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '../libs/exceptions';
import {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken'

export const handleError = (error: Error): void => {
  [
    InternalServerErrorException,
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
    TokenExpiredError,
    JsonWebTokenError,
  ].forEach((e) => {
    if (error instanceof e) throw error
  })
}
