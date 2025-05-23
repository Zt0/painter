import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TaskService } from './services/task.service';
import { ITask } from './interfaces/task.interface';
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
  public async getPostsFeed(): Promise<unknown[]> {
    try {
    const tasks = await this.taskService.getPostsFeed()
    return tasks;
    } catch (e) {
      console.log(e)
    }
  }

  @MessagePattern('post_create')
  public async taskCreate(taskBody: ITask): Promise<unknown> {
    const post = await this.taskService.createTask(taskBody)
    return post;
  }

  @MessagePattern('post_update')
  public async taskUpdate(taskBody: unknown & {id: string}): Promise<unknown> {
    const {id, ...updatedPostData} = taskBody
    await this.taskService.updatePost(id, updatedPostData)
    return {status: 200}
  }

  @MessagePattern('post_get')
  public async taskGet(request: { id: string }): Promise<Post> {
    const post = await this.taskService.getPost(request.id)
    return post
  }

  @MessagePattern('post_delete')
  public async taskDeleteForUser(
    { id }: { id: string }
  ): Promise<unknown> {
    await this.taskService.deletePost(id)
    return true
  }
}
