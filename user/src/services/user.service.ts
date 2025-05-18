import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import {UserRepository} from "../repositories/user.repository";
import {AuthRepository} from "../repositories/auth.repository";
import * as bcrypt from 'bcrypt'
import {Auth} from "../entities/auth.entity";
import { TokensDTO } from '../types/auth';
import {JwtService} from '@nestjs/jwt'
import { User } from '../entities/user.entity';
import { handleError } from '../utils/utils';
import {
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException, NotFoundException,
} from '../libs/exceptions';
import { Equal } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: Partial<Auth>): Promise<void> {
    try {
      const auth = await this.authRepository.findOne({ where: { email: Equal(userData.email) } })
      if (auth) {
        throw new BadRequestException("Email already used by other user")
      }
      userData.password = await bcrypt.hash(userData.password, 10)
      const newAuth = await this.authRepository.save(userData)
      await this.userRepository.save(
        {
          authId: newAuth.id,
          firstName: userData['firstName'],
          lastName: userData['lastName'],
      })
    }
    catch (e) {
      throw e
    }
  }

  private async accessAndRefreshTokens(uuid: string, remember?: boolean): Promise<TokensDTO> {
    const accessToken = await this.jwtService.signAsync({uuid, remember})
    const refreshToken = await this.jwtService.signAsync(
      {uuid, remember},
      {
        expiresIn: this.configService.get('REFRESH_TOKEN_DURATION'),
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      },
    )
    return {
      accessToken,
      refreshToken,
    }
  }

  async login(authBody: Partial<Auth>, remember: boolean): Promise<unknown> {
    try {
      const {email, password} = authBody
      const auth = await this.authRepository.findOne({ where: {email: Equal(email)} })
      if (!await bcrypt.compare(password, auth.password)) {
        throw new UnauthorizedException("invalid login or password")
      }
      const accessAndRefreshTokens = await this.accessAndRefreshTokens(auth.uuid, remember)
      return accessAndRefreshTokens
    } catch (error) {
      handleError(error)
      throw new InternalServerErrorException("internal")
    }
  }

  async getUserById(uuid: string): Promise<User> {
    const auth = await this.authRepository.findOne({where: {uuid}})
    if (!auth) {
      throw new NotFoundException("auth not found")
    }
    const user = await this.userRepository.findOne({where: {authId: Equal(auth.id)}})
    return user
  }

  async createUser(jobSeekerDTO: {userRequest: Record<string, string>, uuid: string}): Promise<void> {
    try {
      const { uuid, userRequest } = jobSeekerDTO
      const auth = await this.authRepository.findOne({ where: {uuid} })
      await this.userRepository.insert({...userRequest, uuid, authId: auth.id} as Partial<User>)
    } catch (error) {
      throw error
    }
  }
}
