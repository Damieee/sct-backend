import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCoWorkingSpaceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pricing_range: string;

  @ApiProperty()
  @IsOptional()
  facilities: any;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty()
  @IsOptional()
  contact_info: any;

}
