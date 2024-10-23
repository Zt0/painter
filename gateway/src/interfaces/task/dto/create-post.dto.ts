import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'test task' })
  title: string;
  @ApiProperty({ example: 'test task description' })
  description: string;
}
