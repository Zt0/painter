import { Controller, HttpStatus, Inject, Req } from '@nestjs/common';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';

import { UserService } from './services/user.service';
import { IUser } from './interfaces/user.interface';
import { IUserCreateResponse } from './interfaces/user-create-response.interface';
import { IUserSearchResponse } from './interfaces/user-search-response.interface';
import { IUserConfirmResponse } from './interfaces/user-confirm-response.interface';
import {User} from "./entities/user.entity";
import { Auth } from './entities/auth.entity';
import { RequestWithUUID } from './types/auth';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('MAILER_SERVICE') private readonly mailerServiceClient: ClientProxy,
  ) {}

  @MessagePattern('user_search_by_credentials')
  public async searchUserByCredentials(searchParams: {
    email: string;
    password: string;
  }): Promise<IUserSearchResponse> {
    let result: IUserSearchResponse;
    return result;
  }

  @MessagePattern('user_get_by_id')
  public async getUserById(id: string): Promise<User> {
    console.log(4,{id})
    const result = await this.userService.getUserById(Number(id))
    console.log({result});
    return result;
  }

  @MessagePattern('user_confirm')
  public async confirmUser(confirmParams: {
    link: string;
  }): Promise<IUserConfirmResponse> {
    let result: IUserConfirmResponse;

    return result;
  }

  @MessagePattern('register')
  public async register(userParams: Partial<User>): Promise<IUserCreateResponse> {
    console.log(3335, userParams)

    let result: IUserCreateResponse;
    await this.userService.register(userParams)
    return {status: 200, message: "done", user: null, errors: null};
  }

  @MessagePattern('login')
  public async login(userParams: Partial<Auth>): Promise<unknown> {
    console.log(3335, userParams)

    let result: IUserCreateResponse;
    const tokens = await this.userService.login(userParams, true)
    console.log({tokens})
    return {status: 200, message: "done", user: tokens, errors: null};
  }

  @MessagePattern('create_user')
  public async createUser(userParams: unknown): Promise<unknown> {
    console.log(3336, userParams)
    await this.userService.createUser(userParams as {userRequest: Record<string, string>, uuid: string})
    return {status: 200, message: "done", user: null, errors: null};
  }
}
