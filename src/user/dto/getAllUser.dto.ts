import { ApiProperty } from '@nestjs/swagger';

export class GetAllUserDto {
  @ApiProperty({ type: Number, description: 'Page' })
  page: number;

  @ApiProperty({ type: Number, description: 'Limit' })
  limit: number;
}
