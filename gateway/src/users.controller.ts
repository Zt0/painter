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

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Get('/:id')
  // @Authorization(true)
  // @ApiOkResponse({
  //   type: GetUserByTokenResponseDto,
  // })
  public async getUserByToken(
    @Param('id') id: string,
    @Req() request: IAuthorizedRequest,
  ): Promise<unknown> {
    const userInfo = request.user;
    console.log(id, 33)
    const userResponse: IServiceUserGetByIdResponse = await firstValueFrom(
      this.userServiceClient.send('user_get_by_id', id),
    );
    console.log({ userResponse });
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
    console.log('post user')
    const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('register', userRequest),
    );
    console.log(353)
    if (createUserResponse.status !== HttpStatus.CREATED) {
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

  @Post('/login')
  // @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({
    type: LoginUserResponseDto,
  })
  public async loginUser(
    @Body() loginRequest: LoginUserDto,
  ): Promise<unknown> {
    console.log(3)
    const getUserResponse: unknown & {user: {accessToken: string, refreshToken: string}} = await firstValueFrom(
      this.userServiceClient.send('login', loginRequest),
    );
    console.log(4)
    return {
      message: 'createTokenResponse.message',
      data: {
        accessToken: getUserResponse.user.accessToken,
        refreshToken: getUserResponse.user.refreshToken,
      },
      errors: null,
    };
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
    console.log('create user', userRequest, uuid)
    const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('create_user', { userRequest, uuid }),
    );
    console.log(353)

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
