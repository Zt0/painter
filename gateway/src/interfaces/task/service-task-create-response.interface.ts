import { ITask } from './task.interface';

export interface IServiceTaskCreateResponse {
  status: number;
  message: string;
  task: ITask | null;
  errors: { [key: string]: any };
}

import { IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  imageUrl?: string;
}
