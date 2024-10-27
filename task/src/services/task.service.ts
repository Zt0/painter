import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { Post } from '../entities/post.entity';

@Injectable()
export class TaskService {
  constructor(
    private readonly postRepository: PostRepository
  ) {
  }

  async createTask(postData: unknown): Promise<Post> {
    const post = await this.postRepository.save(postData as Post)
    console.log({post});
    return post
  }

  async getPosts(authUUID: string): Promise<Post[]> {
    const posts = await this.postRepository.find({where: {authUUID: authUUID}})
    console.log({posts});
    return posts
  }
}
