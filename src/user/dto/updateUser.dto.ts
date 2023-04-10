import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Update Email' })
  newEmail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'First name' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Last name' })
  lastName: string;
}
