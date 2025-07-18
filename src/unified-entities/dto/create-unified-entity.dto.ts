import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
  Matches,
  IsEmail,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EntityType } from '../../auth/entity-type.enum';
import { Category } from '../../shared/category.enum';
import { EventType } from '../../events/event-type.enum';
import { Weekdays } from '../../co-working-spaces/weekdays.enum';

// Nested classes for complex objects
class SocialMedia {
  @ApiProperty({
    description: 'Website URL',
    example: 'https://www.secondarycity.tech/',
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({
    description: 'Facebook Page URL',
    example: 'https://facebook.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    description: 'Instagram Page URL',
    example: 'https://instagram.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    description: 'Twitter Handle URL',
    example: 'https://x.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiProperty({
    description: 'LinkedIn Page URL',
    example: 'https://linkedin.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  linkedIn?: string;

  @ApiProperty({
    description: 'YouTube Channel URL',
    example: 'https://youtube.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  youTube?: string;
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

class DateTime {
  @ApiProperty({
    description: 'Start Date of the Event',
    example: '2024-01-15T10:00:00Z',
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'End Date of the Event',
    example: '2024-01-15T18:00:00Z',
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;
}

class OrganizerDetails {
  @ApiProperty({
    description: 'Organizer Name',
    example: 'Dare Ezekiel',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Organizer Email',
    example: 'joshezekiel.dev@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Organizer Phone Number',
    example: '+234 906 453 1233',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: 'Organizer Website',
    example: 'https://www.secondarycity.tech',
  })
  @IsString()
  @IsOptional()
  website?: string;
}

class Information {
  @ApiProperty({
    description: 'Contact Information',
  })
  @ValidateNested()
  @Type(() => SocialMedia)
  socialMedia: SocialMedia;

  @ApiProperty({
    description: 'Phone Number',
    example: '+1 555 123 4567',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Email Address',
    example: 'info@secondarycity.tech',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class CreateUnifiedEntityDto {
  @ApiProperty({
    description: 'Type of entity to create',
    enum: EntityType,
    example: EntityType.STARTUPS,
  })
  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  // Common fields
  @ApiProperty({
    description: 'Title (for events and news articles)',
    example: 'Tech Conference 2024',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Name (for startups, coworking spaces, training organizations)',
    example: 'Secondary City Tech',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description (for startups and training organizations)',
    example: 'A leading tech company',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Content (for news articles)',
    example: 'This is the article content...',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'About event (for events)',
    example: 'This event will feature...',
  })
  @IsString()
  @IsOptional()
  about_event?: string;

  // Event specific fields
  @ApiProperty({
    description: 'Type of the Event',
    example: 'In-Person',
    enum: EventType,
  })
  @IsEnum(EventType)
  @IsOptional()
  type?: EventType;

  @ApiProperty({
    description: 'Date and Time of the Event',
  })
  @ValidateNested()
  @Type(() => DateTime)
  @IsOptional()
  date_time?: DateTime;

  @ApiProperty({
    description: 'Thumbnail image for event',
    example: 'https://example.com/image.jpg',
  })
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

  @ApiProperty({
    description: 'Organizer Information',
  })
  @ValidateNested()
  @Type(() => OrganizerDetails)
  @IsOptional()
  organizer?: OrganizerDetails;

  @ApiProperty({
    description: 'Registration/RSVP Link',
    example: 'https://www.eventbrite.com/e/event-name-123',
  })
  @IsString()
  @IsOptional()
  registration_url?: string;

  // Startup specific fields
  @ApiProperty({
    description: 'More Information of the Startup',
  })
  @ValidateNested()
  @Type(() => Information)
  @IsOptional()
  information?: Information;

  @ApiProperty({
    description: 'Tags for startup',
    example: { tags: ['tech', 'startup'] },
  })
  @IsOptional()
  tags?: JSON;

  @ApiProperty({
    description: 'Logo URL',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  @IsOptional()
  logo?: string;

  // CoWorking Space specific fields
  @ApiProperty({
    description: 'Daily rate in Nigerian Naira',
    example: 7500,
  })
  @IsNumber()
  @IsOptional()
  daily_rate?: number;

  @ApiProperty({
    description: 'Opening hour details',
  })
  @ValidateNested()
  @Type(() => OpeningHour)
  @IsOptional()
  opening_hour?: OpeningHour;

  @ApiProperty({
    description: 'Facilities available',
    example: 'WiFi, Conference Room, Coffee',
  })
  @IsString()
  @IsOptional()
  facilities?: string;

  // Training Organization specific fields
  @ApiProperty({
    description: 'List of Courses',
    example: ['Web Dev', 'Data Science', 'Motion Graphics'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  courses?: string[];

  // News Article specific fields
  @ApiProperty({
    description: 'Image URL for news article',
    example: 'https://example.com/article-image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  // Common fields
  @ApiProperty({
    description: 'Location details',
  })
  @ValidateNested()
  @Type(() => Location)
  @IsOptional()
  location?: Location;

  @ApiProperty({
    description: 'Website URL',
    example: 'https://www.secondarycity.tech',
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'info@secondarycity.tech',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+234 906 453 1233',
  })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({
    description: 'Category',
    enum: Category,
  })
  @IsEnum(Category)
  @IsOptional()
  category?: Category;
} 