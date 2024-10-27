import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TaskService } from './services/task.service';
import { ITask } from './interfaces/task.interface';
import { ITaskUpdateParams } from './interfaces/task-update-params.interface';
import { ITaskSearchByUserResponse } from './interfaces/task-search-by-user-response.interface';
import { ITaskDeleteResponse } from './interfaces/task-delete-response.interface';
import { ITaskCreateResponse } from './interfaces/task-create-response.interface';
import { ITaskUpdateByIdResponse } from './interfaces/task-update-by-id-response.interface';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern('posts_get')
  public async taskSearchByUserId(
    {authUUID}:{ authUUID: string },
  ): Promise<unknown[]> {
    const tasks = await this.taskService.getPosts(authUUID)
    return tasks;
  }

  @MessagePattern('task_update_by_id')
  public async taskUpdateById(params: {
    task: ITaskUpdateParams;
    id: string;
    userId: string;
  }): Promise<ITaskUpdateByIdResponse> {
    let result: ITaskUpdateByIdResponse;
    return result;
  }

  @MessagePattern('post_create')
  public async taskCreate(taskBody: ITask): Promise<unknown> {
    let result: ITaskCreateResponse;
    console.log({taskBody});
    const post = await this.taskService.createTask(taskBody)
    return post;
  }

  @MessagePattern('task_delete_by_id')
  public async taskDeleteForUser(params: {
    userId: string;
    id: string;
  }): Promise<ITaskDeleteResponse> {
    let result: ITaskDeleteResponse;

    return result;
  }
}
