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
  HttpStatus, UseGuards,
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
import { CreatePostDto } from './interfaces/task/dto/create-post.dto';
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
  @Authorization(true)
  @Permission('task_search_by_user_id')
  @ApiOkResponse({
    type: GetTasksResponseDto,
    description: 'List of tasks for signed in user',
  })
  public async getTasks(
    @Req() request: IAuthorizedRequest,
  ): Promise<GetTasksResponseDto> {
    const userInfo = request.user;

    const tasksResponse: IServiceTaskSearchByUserIdResponse = await firstValueFrom(
      this.taskServiceClient.send('task_search_by_user_id', userInfo.id),
    );

    return {
      message: tasksResponse.message,
      data: {
        tasks: tasksResponse.tasks,
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
  ): Promise<CreateTaskResponseDto> {
    console.log(34343)
    const createTaskResponse: IServiceTaskCreateResponse = await firstValueFrom(
      this.taskServiceClient.send(
        'task_create',
        Object.assign(taskRequest, {uuid}),
      ),
    );
    console.log("end")

    if (createTaskResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createTaskResponse.message,
          data: null,
          errors: createTaskResponse.errors,
        },
        createTaskResponse.status,
      );
    }

    return {
      message: createTaskResponse.message,
      data: {
        task: createTaskResponse.task,
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

  @Put(':id')
  @Authorization(true)
  @Permission('task_update_by_id')
  @ApiOkResponse({
    type: UpdateTaskResponseDto,
  })
  public async updateTask(
    @Req() request: IAuthorizedRequest,
    @Param() params: TaskIdDto,
    @Body() taskRequest: UpdateTaskDto,
  ): Promise<UpdateTaskResponseDto> {
    const userInfo = request.user;
    const updateTaskResponse: IServiceTaskUpdateByIdResponse = await firstValueFrom(
      this.taskServiceClient.send('task_update_by_id', {
        id: params.id,
        userId: userInfo.id,
        task: taskRequest,
      }),
    );

    if (updateTaskResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateTaskResponse.message,
          errors: updateTaskResponse.errors,
          data: null,
        },
        updateTaskResponse.status,
      );
    }

    return {
      message: updateTaskResponse.message,
      data: {
        task: updateTaskResponse.task,
      },
      errors: null,
    };
  }
}
