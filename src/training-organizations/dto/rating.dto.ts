import { IsInt, Min, Max, IsNumber, IsNotEmpty } from 'class-validator';
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
}
