import {
  Controller,
  Inject,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  HttpException,
  HttpStatus, UseGuards, Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { Authorization } from './decorators/authorization.decorator';
import { Permission } from './decorators/permission.decorator';

import { IAuthorizedRequest } from './interfaces/common/authorized-request.interface';
import { EditTaskDto, IServiceTaskCreateResponse } from './interfaces/task/service-task-create-response.interface';
import { IServiceTaskDeleteResponse } from './interfaces/task/service-task-delete-response.interface';
import { CreateTaskResponseDto } from './interfaces/task/dto/create-task-response.dto';
import { DeleteTaskResponseDto } from './interfaces/task/dto/delete-task-response.dto';
import { CreatePostDto, UpdatePostDto } from './interfaces/task/dto/create-post.dto';
import { TaskIdDto } from './interfaces/task/dto/task-id.dto';
import { RolesGuard } from './services/guards/role.guard';
import { Role } from './services/guards/authorization.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Storage } from '@google-cloud/storage';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from './services/config/config.service';
import { StructuredLogger } from './services/logger';
import { File as MulterFile } from 'multer';

const config = new ConfigService()

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
  ): Promise<unknown> {
    StructuredLogger.info('getPostsFeed', 'tasksController', {message: 'getting posts'})
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

  @Get('/feed')
  @Role('')
  @UseGuards(RolesGuard)
  public async getPostsFeed(
    @Req() {uuid}: Request & {uuid: string},
  ): Promise<unknown> {
    StructuredLogger.info('getPostsFeed', 'tasksController', {message: 'getting posts feed'})
    const posts: unknown[] = await firstValueFrom(
      this.taskServiceClient.send(
        'posts_feed_get',
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

  @Get('/metrics')
  public async metrics(
    @Req() {uuid}: Request & {uuid: string},
  ): Promise<unknown> {
    return {
      message: 'metrics.message',
      data: {
        
      },
      errors: null,
    };
  }

  @Post()
  @Authorization(true)
  @Role('')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: CreateTaskResponseDto,
  })
  public async createTask(
    @Req() { uuid }: Request & { uuid: string },
    @Body() taskRequest: CreatePostDto,
    @UploadedFile() file: MulterFile,
  ): Promise<unknown> {
    const storage = new Storage({
      credentials: JSON.parse(config.get('POLLIN_FIREBASE_ADMINSDK_SA'))
    });
    const bucketName = 'black-resource-347917.appspot.com';
    let imageUrl = null;

    if (file) {
      const uniqueFileName = `painter-post-images/${uuidv4()}${extname(file.originalname)}`;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(uniqueFileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
          contentType: file.mimetype,
        },
      });

      try {
        blobStream.end(file.buffer);
        imageUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
      } catch (error) {
        console.error('Error uploading file to GCP:', error);
        throw new Error('Failed to upload file to GCP.');
      }
    }

    const createTaskResponse: IServiceTaskCreateResponse = await firstValueFrom(
      this.taskServiceClient.send('post_create', {
        authUUID: uuid,
        ...taskRequest,
        image: imageUrl,
      }),
    );

    return {
      message: 'Task created successfully',
      data: {
        task: createTaskResponse,
      },
      errors: null,
    };
  }

  @Patch(':id')
  @Authorization(true)
  @Role('')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async editTask(
    @Req() { uuid }: Request & { uuid: string },
    @Param('id') taskId: string,
    @Body() taskRequest: EditTaskDto,
    @UploadedFile() file?: MulterFile,
  ): Promise<unknown> {
    const storage = new Storage({
      credentials: JSON.parse(config.get('POLLIN_FIREBASE_ADMINSDK_SA')),
    });
    const bucketName = 'black-resource-347917.appspot.com';
    let imageUrl = taskRequest.imageUrl;

    if (file) {
      const uniqueFileName = `painter-post-images/${uuidv4()}${extname(file.originalname)}`;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(uniqueFileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
          contentType: file.mimetype,
        },
      });

      try {
        blobStream.end(file.buffer);
        imageUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
      } catch (error) {
        console.error('Error uploading file to GCP:', error);
        throw new Error('Failed to upload file to GCP.');
      }
    }

    const updateTaskPayload = {
      authUUID: uuid,
      id: taskId,
      ...(taskRequest.title && { title: taskRequest.title }),
      ...(taskRequest.description && { description: taskRequest.description }),
      image: imageUrl,
    };
    const editTaskResponse: unknown = await firstValueFrom(
      this.taskServiceClient.send('post_update', updateTaskPayload),
    );

    return {
      message: 'Task updated successfully',
      data: {
        task: editTaskResponse,
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

    const deleteTaskResponse: IServiceTaskDeleteResponse = await firstValueFrom(
      this.taskServiceClient.send('post_delete', {
        id: params.id,
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
