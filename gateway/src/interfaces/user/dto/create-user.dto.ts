import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'test1@denrox.com',
  })
  firstName: string;
  @ApiProperty({
    minLength: 6,
    example: 'test11',
  })
  lastName: string;
}
