import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { EventType } from '../event-type.enum';

class Location {
  @ApiProperty({
    description: 'Address Description',
    example: 'Island 4, North Pacific Ocean, Behind Atlantic Ocean',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Google Map Link',
    example:
      'http://maps.google.com/maps?z=11&t=k&q=58%2041.881N%20152%2031.324W',
  })
  @IsString()
  @IsNotEmpty()
  link: string;
}

class OrganizerDetails {
  @ApiProperty({ description: 'Organizer Name', example: 'Dare Ezekiel' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Organizer Email',
    example: 'joshezekiel.dev@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Organizer Phone Number',
    example: '+234 906 453 1233',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('NG')
  phone_number: string;

  @ApiProperty({
    description: 'Organizer Website',
    example: 'abcuniversity.com',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  website: string;
}

class DateTime {
  @ApiProperty({
    description: 'Start date and time of the event (ISO 8601 format)',
    example: '2020-02-05T06:35:22.000Z',
    format: 'date-time', // This indicates ISO 8601 date-time format
  })
  @IsNotEmpty()
  @IsDateString(
    { strict: true },
    { message: 'Start date must be in ISO 8601 format' },
  )
  startDate: string;

  @ApiProperty({
    description: 'End date and time of the event (ISO 8601 format)',
    example: '2020-02-05T09:35:22.000Z',
    format: 'date-time', // ISO 8601 format
  })
  @IsNotEmpty()
  @IsDateString(
    { strict: true },
    { message: 'End date must be in ISO 8601 format' },
  )
  endDate: string;
}

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Type ppf the Event',
    example: 'In-Person',
    enum: EventType,
  })
  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;

  @ApiProperty({ description: 'Date and Time of the Event' })
  @ValidateNested({ each: true })
  @Type(() => DateTime)
  date_time: DateTime;

  @ApiProperty({ description: 'Location details' })
  @ValidateNested({ each: true })
  @Type(() => Location)
  location: Location;

  @ApiProperty()
  @IsString()
  @IsOptional()
  thumbnail_image?: string;

  @ApiProperty({
    description: 'Cost to Attend in Naira, If Applicable',
    example: 4500,
  })
  @IsNumber()
  @IsOptional()
  pricing?: number;

  @ApiProperty({ description: 'Organizer Information' })
  @ValidateNested({ each: true })
  @Type(() => OrganizerDetails)
  organizer: OrganizerDetails;

  @ApiProperty({
    description: 'Registration/RSVP Link',
    example: 'https://www.eventbrite.com/e/event-name-123',
  })
  @IsString()
  @IsOptional()
  registration_url: string;

  // Offerings: List of what is included (e.g., materials, refreshments)
  @ApiProperty({
    description: 'List of Offerings',
    example: ['Conference Room', 'Banquet Hall', 'Snacks'],
  })
  @IsString({ each: true })
  @IsNotEmpty()
  offerings: string[];
}
