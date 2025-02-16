import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {JwtService} from '@nestjs/jwt'
import {JsonWebTokenError} from 'jsonwebtoken'
import { AuthRepository } from '../../repositories/auth.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  // eslint-disable-next-line max-params
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest()
      const authorizationHeader = req.headers.authorization
      console.log({authorizationHeader})
      if (!authorizationHeader)
        throw new JsonWebTokenError('JwtMalformed')

      const token = authorizationHeader.split(' ')[1]
      const {uuid} = await this.jwtService.verifyAsync(token)
      req.uuid = uuid
      return true
    } catch (error) {
      throw error
    }
  }
}
