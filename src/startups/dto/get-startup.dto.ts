import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class filterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  search: string;
}
