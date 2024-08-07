import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class filterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  search: string;

}
