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

export class RateStartupDto {
  @ApiProperty({ description: 'Rating of the startup', example: 4 })
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number = 0; // Ensures rating is between 1-5

  @ApiProperty({
    description: 'Review of the startup',
    example: 'I love this startup',
  })
  @IsString()
  @IsOptional()
  review: string;
}
