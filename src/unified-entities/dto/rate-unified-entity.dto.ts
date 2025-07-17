import {
  IsInt,
  Min,
  Max,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RateUnifiedEntityDto {
  @ApiProperty({ description: 'Rating of the unified entity', example: 4 })
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number = 0; // Ensures rating is between 1-5

  @ApiProperty({
    description: 'Review of the unified entity',
    example: 'I love this unified entity',
  })
  @IsString()
  @IsOptional()
  review: string;
} 