import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  ValidateNested,
  Matches,
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

  @ApiProperty({
    description: 'opening time of the workspace (Format: HH:mm AM/PM)',
    example: '10:00 AM',
    format: 'time',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]):([0-5][0-9]) (AM|PM)$/i, {
    message: 'opening time must be in the format HH:mm AM/PM',
  })
  opening_time: string;

  @ApiProperty({
    description: 'Closing time of the workspace (Format: HH:mm AM/PM)',
    example: '02:00 PM',
    format: 'time',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]):([0-5][0-9]) (AM|PM)$/i, {
    message: 'Closing time must be in the format HH:mm AM/PM',
  })
  closing_time: string;
}

export class CreateTrainingOrganizationDto {
  @ApiProperty({ description: 'The name of the Training Organization' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The location address of the Training Organization',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Opening hour details' })
  @ValidateNested({ each: true })
  @Type(() => OpeningHour)
  opening_hour: OpeningHour;

  @ApiProperty({
    description: 'List of Courses',
    example: ['Web Dev', 'Data Science', 'Motion Graphics'],
  })
  @IsString({ each: true })
  @IsNotEmpty()
  courses: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo?: string;

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
