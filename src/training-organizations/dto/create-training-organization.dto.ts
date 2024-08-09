import { ApiProperty } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTrainingOrganizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsJSON()
  courses: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty()
  @IsOptional()
  contact_info: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
