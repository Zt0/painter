import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'test task' })
  title: string;
  @ApiProperty({ example: 'test task description' })
  description: string;

  @IsString()
  @IsOptional()
  imageURL: string

  @IsBoolean()
  @IsOptional()
  private: boolean
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
