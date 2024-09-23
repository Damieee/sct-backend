import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  ValidateNested,
  Matches,
  IsNumber,
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

class Location {
  @ApiProperty({
    description: 'Address Description',
    example: 'Island 4, North Pacific Ocean, Behind Atlantic Ocean',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Google Map Url',
    example:
      'http://maps.google.com/maps?z=11&t=k&q=58%2041.881N%20152%2031.324W',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Latitude',
    example: '41.88193',
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Longitude',
    example: '-152.31368',
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'City',
    example: 'Anytown',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'State/Province',
    example: 'Alaska',
  })
  @IsString()
  @IsNotEmpty()
  state_province: string;

  @ApiProperty({
    description: 'Country',
    example: 'USA',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Postal Code',
    example: '99547',
  })
  @IsString()
  @IsNotEmpty()
  postal_code: string;
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

  @ApiProperty({ description: 'Location details' })
  @ValidateNested({ each: true })
  @Type(() => Location)
  location: Location;

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
