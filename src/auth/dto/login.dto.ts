/*  Login data transfer object */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Username' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Password' })
  password: string;
}
