/*  Register data transfer object */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Name' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'Email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Password' })
  password: string;
}
