import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsInt,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Weekdays } from '../weekdays.enum';
import { Type } from 'class-transformer';

class OpeningHour {
  @ApiProperty({
    description: 'Start Day of the week',
    example: 'Monday',
    enum: Weekdays,
  })
  @IsEnum(Weekdays)
  @IsNotEmpty()
  week_start: Weekdays;

  @ApiProperty({
    description: 'End Day of the week',
    example: 'Friday',
    enum: Weekdays,
  })
  @IsEnum(Weekdays)
  @IsNotEmpty()
  week_end: Weekdays;

  @ApiProperty({ description: 'Opening time', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(23)
  opening_time: number;

  @ApiProperty({ description: 'Closing time', example: 22 })
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(23)
  closing_time: number;
}

export class CreateCoWorkingSpaceDto {
  @ApiProperty({ description: 'The name of the coworking space' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The location address of the coworking space' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Opening hour details' })
  @ValidateNested({ each: true })
  @Type(() => OpeningHour)
  opening_hour: OpeningHour;

  @ApiProperty({ description: 'Daily rate in Nigerian Naira', example: 7500 })
  @IsNumber()
  @IsNotEmpty()
  daily_rate: number;

  @ApiProperty()
  @IsOptional()
  facilities: string;

  @ApiProperty()
  @IsOptional()
  phone_number: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  website: string;
}

// mutiple image for one co working space, review

// Only Admins should be able to write articles.

// Merging reviews with other modules
