import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TaskService } from './services/task.service';
import { ITask } from './interfaces/task.interface';
import { ITaskUpdateParams } from './interfaces/task-update-params.interface';
import { ITaskSearchByUserResponse } from './interfaces/task-search-by-user-response.interface';
import { ITaskDeleteResponse } from './interfaces/task-delete-response.interface';
import { ITaskCreateResponse } from './interfaces/task-create-response.interface';
import { ITaskUpdateByIdResponse } from './interfaces/task-update-by-id-response.interface';
import { Post } from './entities/post.entity';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern('posts_get')
  public async getUserPosts(
    {authUUID}:{ authUUID: string },
  ): Promise<unknown[]> {
    const tasks = await this.taskService.getPosts(authUUID)
    return tasks;
  }

  @MessagePattern('posts_feed_get')
  public async getPostsFeed(
    {authUUID}:{ authUUID: string },
  ): Promise<unknown[]> {
    const tasks = await this.taskService.getPostsFeed()
    return tasks;
  }

  @MessagePattern('post_create')
  public async taskCreate(taskBody: ITask): Promise<unknown> {
    let result: ITaskCreateResponse;
    console.log({taskBody});
    const post = await this.taskService.createTask(taskBody)
    return post;
  }

  @MessagePattern('post_update')
  public async taskUpdate(taskBody: unknown & {id: string}): Promise<unknown> {
    const {id, ...updatedPostData} = taskBody
    console.log({upd: taskBody});
    await this.taskService.updatePost(id, updatedPostData)
    return {status: 200}
  }

  @MessagePattern('post_get')
  public async taskGet(request: { id: string }): Promise<Post> {
    console.log({getPost: request.id});
    const post = await this.taskService.getPost(request.id)
    return post
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
