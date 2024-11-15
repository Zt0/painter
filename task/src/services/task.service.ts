import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { Post } from '../entities/post.entity';
import { Equal } from 'typeorm';

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

  async updatePost(uuid: string, postData: unknown): Promise<void> {
    try {
      await this.postRepository.update({ uuid }, postData as Post)

    }catch (error) {
      console.log(error)
    }
  }

  async getPost(uuid: string): Promise<Post> {
    console.log({uuid});
    const post = await this.postRepository.findOne({where: {uuid: Equal(uuid)}})
    console.log({post});
    return post
  }

  async getPosts(authUUID: string): Promise<Post[]> {
    const posts = await this.postRepository.find({where: {authUUID: authUUID}})
    console.log({posts});
    return posts
  }

  async getPostsFeed(): Promise<Post[]> {
    const posts = await this.postRepository.find({where: {public: true}})
    console.log({posts});
    return posts
  }

  async deletePost(uuid: string): Promise<void> {
    await this.postRepository.delete({ uuid: Equal(uuid) })
  }
}
