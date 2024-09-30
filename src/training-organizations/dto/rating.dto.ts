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

export class RateTrainingOrganizationDto {
  @ApiProperty({
    description: 'Rating of the Training Organization',
    example: 3,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number = 0; // Ensures rating is between 1-5

  @ApiProperty({
    description: 'Review of the training organization',
    example: 'I love this training organization',
  })
  @IsString()
  @IsOptional()
  review: string;
}
