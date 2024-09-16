import { IsInt, Min, Max, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RateCoworkingSpaceDto {
  @ApiProperty({ description: 'Rating of the coworking space', example: 4.5 })
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number = 0; // Ensures rating is between 1-5
}
