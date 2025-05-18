import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Req,
  Inject,
  HttpStatus,
  HttpException,
  Param, UseGuards,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

import { Authorization } from './decorators/authorization.decorator';
import { IAuthorizedRequest } from './interfaces/common/authorized-request.interface';
import { IServiceUserCreateResponse } from './interfaces/user/service-user-create-response.interface';
import { IServiceUserSearchResponse } from './interfaces/user/service-user-search-response.interface';
import { IServiveTokenCreateResponse } from './interfaces/token/service-token-create-response.interface';
import { IServiceTokenDestroyResponse } from './interfaces/token/service-token-destroy-response.interface';
import { IServiceUserConfirmResponse } from './interfaces/user/service-user-confirm-response.interface';
import { IServiceUserGetByIdResponse } from './interfaces/user/service-user-get-by-id-response.interface';

import { GetUserByTokenResponseDto } from './interfaces/user/dto/get-user-by-token-response.dto';
import { CreateUserDto } from './interfaces/user/dto/create-user.dto';
import { CreateUserResponseDto } from './interfaces/user/dto/create-user-response.dto';
import { LoginUserDto } from './interfaces/user/dto/login-user.dto';
import { LoginUserResponseDto } from './interfaces/user/dto/login-user-response.dto';
import { LogoutUserResponseDto } from './interfaces/user/dto/logout-user-response.dto';
import { ConfirmUserDto } from './interfaces/user/dto/confirm-user.dto';
import { ConfirmUserResponseDto } from './interfaces/user/dto/confirm-user-response.dto';
import { Role } from './services/guards/authorization.guard';
import { LocalAuthGuard } from './services/guards/permission.guard';
import { RolesGuard } from './services/guards/role.guard';
import { StructuredLogger } from './services/logger';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Get(':id')
  @UseGuards(RolesGuard)
  public async getUserByToken(
    @Param('id') id: string,
    @Req() {uuid}: Request & {uuid: string},
  ): Promise<unknown> {
    const userResponse: IServiceUserGetByIdResponse = await firstValueFrom(
      this.userServiceClient.send('user_get_by_id', { uuid }),
    );
    return {
      message: 'userResponse.message',
      data: {
        user: userResponse,
      },
      errors: null,
    };
  }

  @Post()
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
  })
  public async register(
    @Body() userRequest: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('register', userRequest),
    );
    if (createUserResponse.status !== 200) {
      throw new HttpException(
        {
          message: createUserResponse.message,
          data: null,
          errors: createUserResponse.errors,
        },
        createUserResponse.status,
      );
    }

    return {
      message: createUserResponse.message,
      data: {
        user: createUserResponse.user,
        token: '',
      },
      errors: null,
    };
  }

  @Throttle({ default: { limit: 3, ttl: (60 * 1000) } })
  @Post('/login')
  @ApiCreatedResponse({
    type: LoginUserResponseDto,
  })
  public async loginUser(
    @Body() loginRequest: LoginUserDto,
  ): Promise<unknown> {
    try  {
      const getUserResponse: unknown & {user: {accessToken: string, refreshToken: string}} = await firstValueFrom(
        this.userServiceClient.send('login', loginRequest),
      );
      return {
        message: 'createTokenResponse.message',
        data: {
          accessToken: getUserResponse.user.accessToken,
          refreshToken: getUserResponse.user.refreshToken,
        },
        errors: null,
      };
    } catch (e) {
      e.message = 'Invalid credentials';
      StructuredLogger.error('exception', 'internal exception', {message: e?.message, email: loginRequest.email})
      throw e
    }
    
  }

  @Post('user')
  @Role('')
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
  })
  public async createUser(
    @Req() {uuid}: Request & {uuid: string},
    @Body() userRequest: CreateUserDto,
  ): Promise<unknown> {
    const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('create_user', { userRequest, uuid }),
    );

    return {
      message: 'createUserResponse.message',
      data: {
        user: null,
      },
      errors: null,
    };
  }

  @Put('/logout')
  @Authorization(true)
  @ApiCreatedResponse({
    type: LogoutUserResponseDto,
  })
  public async logoutUser(
    @Req() request: IAuthorizedRequest,
  ): Promise<LogoutUserResponseDto> {
    const userInfo = request.user;

    return {
      message: '',
      errors: null,
      data: null,
    };
  }

  @Get('/confirm/:link')
  @ApiCreatedResponse({
    type: ConfirmUserResponseDto,
  })
  public async confirmUser(
    @Param() params: ConfirmUserDto,
  ): Promise<ConfirmUserResponseDto> {
    const confirmUserResponse: IServiceUserConfirmResponse = await firstValueFrom(
      this.userServiceClient.send('user_confirm', {
        link: params.link,
      }),
    );

    if (confirmUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: confirmUserResponse.message,
          data: null,
          errors: confirmUserResponse.errors,
        },
        confirmUserResponse.status,
      );
    }

    return {
      message: confirmUserResponse.message,
      errors: null,
      data: null,
    };
  }
}
