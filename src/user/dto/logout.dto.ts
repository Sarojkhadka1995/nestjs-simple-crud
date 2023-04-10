import { ApiProperty } from '@nestjs/swagger';

export class LogoutDTO {
  @ApiProperty({ type: String, description: 'Email' })
  userId: string;
}
