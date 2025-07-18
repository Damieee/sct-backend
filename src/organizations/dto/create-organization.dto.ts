import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  IsObject, 
  IsEnum, 
  IsUrl, 
  IsEmail,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationSubcategory } from '../../shared/organization-subcategory.enum';
import { LocationDto } from './location.dto';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Name of the organization',
    example: 'TechHub Abeokuta',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the organization',
    example: 'A leading tech hub in Abeokuta that provides incubation services, training programs, and coworking spaces for startups and tech professionals.',
    minLength: 10,
    maxLength: 1000
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Subcategory of the organization',
    enum: OrganizationSubcategory,
    example: OrganizationSubcategory.TECH_HUB_TRAINING_CENTER
  })
  @IsEnum(OrganizationSubcategory)
  subcategory: OrganizationSubcategory;

  @ApiPropertyOptional({
    description: 'Services offered by the organization',
    example: ['Incubation', 'Training Programs', 'Mentorship', 'Networking Events', 'Funding Support'],
    isArray: true,
    maxItems: 10
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  services_offered?: string[];

  @ApiPropertyOptional({
    description: 'Target audience for the organization',
    example: ['Startups', 'Students', 'Professionals', 'Entrepreneurs', 'Tech Enthusiasts'],
    isArray: true,
    maxItems: 10
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  target_audience?: string[];

  @ApiProperty({
    description: 'Location information of the organization',
    type: LocationDto
  })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsObject()
  @IsNotEmpty()
  location: LocationDto;

  @ApiProperty({
    description: 'Website URL of the organization',
    example: 'https://techhubabeokuta.com'
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  website: string;

  @ApiProperty({
    description: 'Email address of the organization',
    example: 'contact@techhubabeokuta.com'
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the organization',
    example: '+2348012345678'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  phone_number: string;

  @ApiProperty({
    description: 'Logo URL of the organization',
    example: 'https://example.com/logo.png'
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  logo: string;

  @ApiPropertyOptional({
    description: 'Opening hours of the organization',
    example: {
      week_start: 'Monday',
      week_end: 'Friday',
      opening_time: '09:00 AM',
      closing_time: '06:00 PM'
    }
  })
  @IsOptional()
  @IsObject()
  opening_hour?: {
    week_start: string;
    week_end: string;
    opening_time: string;
    closing_time: string;
  };
} 