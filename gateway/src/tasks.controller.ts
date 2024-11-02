import {
  Controller,
  Inject,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  HttpException,
  HttpStatus, UseGuards, Patch,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

import { Authorization } from './decorators/authorization.decorator';
import { Permission } from './decorators/permission.decorator';

import { IAuthorizedRequest } from './interfaces/common/authorized-request.interface';
import { IServiceTaskCreateResponse } from './interfaces/task/service-task-create-response.interface';
import { IServiceTaskDeleteResponse } from './interfaces/task/service-task-delete-response.interface';
import { IServiceTaskSearchByUserIdResponse } from './interfaces/task/service-task-search-by-user-id-response.interface';
import { IServiceTaskUpdateByIdResponse } from './interfaces/task/service-task-update-by-id-response.interface';
import { GetTasksResponseDto } from './interfaces/task/dto/get-tasks-response.dto';
import { CreateTaskResponseDto } from './interfaces/task/dto/create-task-response.dto';
import { DeleteTaskResponseDto } from './interfaces/task/dto/delete-task-response.dto';
import { UpdateTaskResponseDto } from './interfaces/task/dto/update-task-response.dto';
import { CreatePostDto, UpdatePostDto } from './interfaces/task/dto/create-post.dto';
import { UpdateTaskDto } from './interfaces/task/dto/update-task.dto';
import { TaskIdDto } from './interfaces/task/dto/task-id.dto';
import { RolesGuard } from './services/guards/role.guard';
import { Role } from './services/guards/authorization.guard';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskServiceClient: ClientProxy,
  ) {}

  @Get()
  @Role('')
  @UseGuards(RolesGuard)
  public async getPosts(
    @Req() {uuid}: Request & {uuid: string},
    @Body() taskRequest: CreatePostDto,
  ): Promise<unknown> {
    console.log(34343)
    const posts: unknown[] = await firstValueFrom(
      this.taskServiceClient.send(
        'posts_get',
        { authUUID: uuid },
      ),
    );

    return {
      message: 'getPosts.message',
      data: {
        task: posts,
      },
      errors: null,
    };
  }

  @Post()
  @Authorization(true)
  @Role('')
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({
    type: CreateTaskResponseDto,
  })
  public async createTask(
    @Req() {uuid}: Request & {uuid: string},
    @Body() taskRequest: CreatePostDto,
  ): Promise<unknown> {
    console.log(34343)
    const createTaskResponse: IServiceTaskCreateResponse = await firstValueFrom(
      this.taskServiceClient.send(
        'post_create',
        { authUUID: uuid, ...taskRequest },
      ),
    );
    console.log("end")

    return {
      message: 'createTaskResponse.message',
      data: {
        task: createTaskResponse,
      },
      errors: null,
    };
  }

  @Patch('/:id')
  @Authorization(true)
  @Role('')
  @UseGuards(RolesGuard)
  public async updatePost(
    @Req() {uuid}: Request & {uuid: string},
    @Body() taskRequest: UpdatePostDto,
    @Param('id') id: string,
  ): Promise<unknown> {
    const updateTaskResponse: IServiceTaskCreateResponse = await firstValueFrom(
      this.taskServiceClient.send(
        'post_update',
        { id, authUUID: uuid, ...taskRequest },
      ),
    );
    console.log({updateTaskResponse});
    return {
      message: 'updateTaskResponse.message',
      data: {
        task: updateTaskResponse,
      },
      errors: null,
    };
  }

  @Get('/:id')
  @Authorization(true)
  @Role('')
  @UseGuards(RolesGuard)
  public async getPost(
    @Req() {uuid}: Request & {uuid: string},
    @Param('id') id: string,
  ): Promise<unknown> {
    const getPostResponse: IServiceTaskCreateResponse = await firstValueFrom(
      this.taskServiceClient.send(
        'post_get',
        { id, authUUID: uuid },
      ),
    );
    console.log({getPostResponse});
    return {
      message: 'getPost.message',
      data: {
        task: getPostResponse,
      },
      errors: null,
    };
  }

  @Delete(':id')
  @Authorization(true)
  @Permission('task_delete_by_id')
  @ApiOkResponse({
    type: DeleteTaskResponseDto,
  })
  public async deleteTask(
    @Req() request: IAuthorizedRequest,
    @Param() params: TaskIdDto,
  ): Promise<DeleteTaskResponseDto> {
    const userInfo = request.user;

    const deleteTaskResponse: IServiceTaskDeleteResponse = await firstValueFrom(
      this.taskServiceClient.send('task_delete_by_id', {
        id: params.id,
        userId: userInfo.id,
      }),
    );

    if (deleteTaskResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deleteTaskResponse.message,
          errors: deleteTaskResponse.errors,
          data: null,
        },
        deleteTaskResponse.status,
      );
    }

    return {
      message: deleteTaskResponse.message,
      data: null,
      errors: null,
    };
  }
}
