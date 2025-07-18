import { IsArray, IsNotEmpty, IsObject, ValidateNested, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityType } from '../../shared/entity-type.enum';
import { OrganizationSubcategory } from '../../shared/organization-subcategory.enum';
import { Category } from '../../shared/category.enum';
import { EventType } from '../../events/event-type.enum';

// Location DTO for all entities
export class LocationDto {
  @ApiProperty({
    description: 'Google Maps URL or location URL',
    example: 'https://maps.google.com/maps?q=7.1557,3.3451'
  })
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Full address',
    example: '123 Tech Street, Abeokuta, Ogun State'
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 7.1557
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 3.3451
  })
  longitude: number;

  @ApiProperty({
    description: 'City name',
    example: 'Abeokuta'
  })
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'State or province',
    example: 'Ogun'
  })
  @IsNotEmpty()
  state_province: string;

  @ApiProperty({
    description: 'Country name',
    example: 'Nigeria'
  })
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Postal code',
    example: '110001'
  })
  @IsNotEmpty()
  postal_code: string;
}

// Organization data DTO
export class OrganizationDataDto {
  @ApiProperty({
    description: 'Name of the organization',
    example: 'TechHub Abeokuta'
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed description',
    example: 'A leading tech hub in Abeokuta providing incubation services and training programs.'
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Organization subcategory',
    enum: OrganizationSubcategory,
    example: OrganizationSubcategory.TECH_HUB_TRAINING_CENTER
  })
  @IsEnum(OrganizationSubcategory)
  subcategory: OrganizationSubcategory;

  @ApiProperty({
    description: 'Location information',
    type: LocationDto
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'Website URL',
    example: 'https://techhubabeokuta.com'
  })
  @IsNotEmpty()
  website: string;

  @ApiProperty({
    description: 'Email address',
    example: 'contact@techhubabeokuta.com'
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+2348012345678'
  })
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: 'Logo URL',
    example: 'https://example.com/logo.png'
  })
  @IsNotEmpty()
  logo: string;

  @ApiPropertyOptional({
    description: 'Services offered',
    example: ['Incubation', 'Training Programs', 'Mentorship']
  })
  @IsOptional()
  services_offered?: string[];

  @ApiPropertyOptional({
    description: 'Target audience',
    example: ['Startups', 'Students', 'Professionals']
  })
  @IsOptional()
  target_audience?: string[];

  @ApiPropertyOptional({
    description: 'Opening hours',
    example: {
      week_start: 'Monday',
      week_end: 'Friday',
      opening_time: '09:00 AM',
      closing_time: '06:00 PM'
    }
  })
  @IsOptional()
  opening_hour?: {
    week_start: string;
    week_end: string;
    opening_time: string;
    closing_time: string;
  };
}

// Startup data DTO
export class StartupDataDto {
  @ApiProperty({
    description: 'Name of the startup',
    example: 'TechStartup Inc.'
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Startup description',
    example: 'A fintech startup revolutionizing digital payments.'
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Startup category',
    enum: Category,
    example: Category.FINTECH
  })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    description: 'Location information',
    type: LocationDto
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'Startup information including contact details',
    example: {
      address: '123 Startup Street, Lagos',
      url: 'https://maps.google.com/maps?q=6.5244,3.3792',
      latitude: 6.5244,
      longitude: 3.3792,
      city: 'Lagos',
      state_province: 'Lagos',
      country: 'Nigeria',
      postal_code: '100001',
      socialMedia: {
        website: 'https://techstartup.com',
        facebook: 'https://facebook.com/techstartup',
        instagram: 'https://instagram.com/techstartup',
        twitter: 'https://twitter.com/techstartup',
        linkedIn: 'https://linkedin.com/company/techstartup',
        youTube: 'https://youtube.com/techstartup'
      },
      phoneNumber: '+2348012345678',
      email: 'info@techstartup.com'
    }
  })
  @ValidateNested()
  @Type(() => Object)
  information: any;

  @ApiPropertyOptional({
    description: 'Startup logo URL',
    example: 'https://example.com/startup-logo.png'
  })
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Startup tags',
    example: { tags: ['fintech', 'payments', 'digital'] }
  })
  @IsOptional()
  tags?: any;
}

// Event data DTO
export class EventDataDto {
  @ApiProperty({
    description: 'Event title',
    example: 'Tech Conference 2024'
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Join us for the biggest tech conference of the year.'
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Event type',
    enum: EventType,
    example: EventType.IN_PERSON
  })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({
    description: 'Event category',
    enum: Category,
    example: Category.CONFERENCE
  })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    description: 'Event date and time',
    example: {
      startDate: '2024-03-15T09:00:00.000Z',
      endDate: '2024-03-15T18:00:00.000Z'
    }
  })
  @ValidateNested()
  @Type(() => Object)
  date_time: {
    startDate: string;
    endDate: string;
  };

  @ApiProperty({
    description: 'Event location',
    type: LocationDto
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'Organizer details',
    example: {
      name: 'John Doe',
      email: 'john@example.com',
      phone_number: '+2348012345678',
      website: 'https://organizer.com'
    }
  })
  @ValidateNested()
  @Type(() => Object)
  organizer: {
    name: string;
    email: string;
    phone_number: string;
    website?: string;
  };

  @ApiProperty({
    description: 'About the event',
    example: '<h1>Tech Conference 2024</h1><p>Join industry leaders for networking and insights.</p>'
  })
  @IsNotEmpty()
  about_event: string;

  @ApiPropertyOptional({
    description: 'Event thumbnail image URL',
    example: 'https://example.com/event-thumbnail.jpg'
  })
  @IsOptional()
  thumbnail_image?: string;

  @ApiPropertyOptional({
    description: 'Event pricing in Naira',
    example: 5000
  })
  @IsOptional()
  pricing?: number;

  @ApiPropertyOptional({
    description: 'Registration URL',
    example: 'https://eventbrite.com/e/tech-conference-2024'
  })
  @IsOptional()
  registration_url?: string;
}

// News Article data DTO
export class NewsArticleDataDto {
  @ApiProperty({
    description: 'Article title',
    example: 'Tech Innovation in Nigeria'
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Article content',
    example: 'This article discusses the latest tech innovations in Nigeria...'
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Article category',
    enum: Category,
    example: Category.AI
  })
  @IsEnum(Category)
  category: Category;

  @ApiPropertyOptional({
    description: 'Article image URL',
    example: 'https://example.com/article-image.jpg'
  })
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Article author',
    example: 'John Doe'
  })
  @IsOptional()
  author?: string;
}

// Co-working Space data DTO
export class CoWorkingSpaceDataDto {
  @ApiProperty({
    description: 'Space name',
    example: 'Innovation Hub Co-working'
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Space description',
    example: 'A modern co-working space for entrepreneurs and startups.'
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Space category',
    enum: Category,
    example: Category.COWORKING_SPACE
  })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    description: 'Location information',
    type: LocationDto
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'Space website',
    example: 'https://innovationhub.com'
  })
  @IsNotEmpty()
  website: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'info@innovationhub.com'
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contact phone',
    example: '+2348012345678'
  })
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: 'Space logo URL',
    example: 'https://example.com/space-logo.png'
  })
  @IsNotEmpty()
  logo: string;

  @ApiPropertyOptional({
    description: 'Amenities offered',
    example: ['High-speed WiFi', 'Meeting Rooms', 'Coffee Bar', 'Printing Services']
  })
  @IsOptional()
  amenities?: string[];

  @ApiPropertyOptional({
    description: 'Pricing information',
    example: {
      daily: 5000,
      weekly: 25000,
      monthly: 80000
    }
  })
  @IsOptional()
  pricing?: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
}

// Entity data DTO with union type
export class EntityDataDto {
  @ApiProperty({
    description: 'Type of entity to create',
    enum: EntityType,
    example: EntityType.ORGANIZATION
  })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({
    description: 'Data for the entity (structure depends on entityType)',
    oneOf: [
      { $ref: '#/components/schemas/OrganizationDataDto' },
      { $ref: '#/components/schemas/StartupDataDto' },
      { $ref: '#/components/schemas/EventDataDto' },
      { $ref: '#/components/schemas/NewsArticleDataDto' },
      { $ref: '#/components/schemas/CoWorkingSpaceDataDto' }
    ],
    examples: {
      organization: {
        entityType: 'organization',
        data: {
          name: 'TechHub Abeokuta',
          description: 'A leading tech hub in Abeokuta providing incubation services and training programs.',
          subcategory: 'Tech hub/training center',
          location: {
            url: 'https://maps.google.com/maps?q=7.1557,3.3451',
            address: '123 Tech Street, Abeokuta, Ogun State',
            latitude: 7.1557,
            longitude: 3.3451,
            city: 'Abeokuta',
            state_province: 'Ogun',
            country: 'Nigeria',
            postal_code: '110001'
          },
          website: 'https://techhubabeokuta.com',
          email: 'contact@techhubabeokuta.com',
          phone_number: '+2348012345678',
          logo: 'https://example.com/logo.png',
          services_offered: ['Incubation', 'Training Programs', 'Mentorship'],
          target_audience: ['Startups', 'Students', 'Professionals']
        }
      },
      startup: {
        entityType: 'startup',
        data: {
          name: 'TechStartup Inc.',
          description: 'A fintech startup revolutionizing digital payments.',
          category: 'FinTech',
          location: {
            url: 'https://maps.google.com/maps?q=6.5244,3.3792',
            address: '123 Startup Street, Lagos',
            latitude: 6.5244,
            longitude: 3.3792,
            city: 'Lagos',
            state_province: 'Lagos',
            country: 'Nigeria',
            postal_code: '100001'
          },
          information: {
            address: '123 Startup Street, Lagos',
            url: 'https://maps.google.com/maps?q=6.5244,3.3792',
            latitude: 6.5244,
            longitude: 3.3792,
            city: 'Lagos',
            state_province: 'Lagos',
            country: 'Nigeria',
            postal_code: '100001',
            socialMedia: {
              website: 'https://techstartup.com',
              facebook: 'https://facebook.com/techstartup',
              instagram: 'https://instagram.com/techstartup',
              twitter: 'https://twitter.com/techstartup',
              linkedIn: 'https://linkedin.com/company/techstartup',
              youTube: 'https://youtube.com/techstartup'
            },
            phoneNumber: '+2348012345678',
            email: 'info@techstartup.com'
          },
          logo: 'https://example.com/startup-logo.png'
        }
      },
      event: {
        entityType: 'event',
        data: {
          title: 'Tech Conference 2024',
          description: 'Join us for the biggest tech conference of the year.',
          type: 'In-Person',
          category: 'Conference',
          date_time: {
            startDate: '2024-03-15T09:00:00.000Z',
            endDate: '2024-03-15T18:00:00.000Z'
          },
          location: {
            url: 'https://maps.google.com/maps?q=6.5244,3.3792',
            address: '123 Conference Street, Lagos',
            latitude: 6.5244,
            longitude: 3.3792,
            city: 'Lagos',
            state_province: 'Lagos',
            country: 'Nigeria',
            postal_code: '100001'
          },
          organizer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone_number: '+2348012345678',
            website: 'https://organizer.com'
          },
          about_event: '<h1>Tech Conference 2024</h1><p>Join industry leaders for networking and insights.</p>',
          pricing: 5000,
          registration_url: 'https://eventbrite.com/e/tech-conference-2024'
        }
      },
      news_article: {
        entityType: 'news_article',
        data: {
          title: 'Tech Innovation in Nigeria',
          content: 'This article discusses the latest tech innovations in Nigeria and their impact on the economy.',
          category: 'Technology',
          author: 'John Doe',
          image: 'https://example.com/article-image.jpg'
        }
      },
      co_working_space: {
        entityType: 'co_working_space',
        data: {
          name: 'Innovation Hub Co-working',
          description: 'A modern co-working space for entrepreneurs and startups.',
          category: 'Coworking Space',
          location: {
            url: 'https://maps.google.com/maps?q=6.5244,3.3792',
            address: '123 Innovation Street, Lagos',
            latitude: 6.5244,
            longitude: 3.3792,
            city: 'Lagos',
            state_province: 'Lagos',
            country: 'Nigeria',
            postal_code: '100001'
          },
          website: 'https://innovationhub.com',
          email: 'info@innovationhub.com',
          phone_number: '+2348012345678',
          logo: 'https://example.com/space-logo.png',
          amenities: ['High-speed WiFi', 'Meeting Rooms', 'Coffee Bar', 'Printing Services'],
          pricing: {
            daily: 5000,
            weekly: 25000,
            monthly: 80000
          }
        }
      }
    }
  })
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

// Relationship data interface
export class RelationshipDataDto {
  @ApiProperty({
    description: 'ID of the primary entity',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  primaryEntityId: string;

  @ApiProperty({
    description: 'Type of the primary entity',
    enum: EntityType,
    example: EntityType.ORGANIZATION
  })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({
    description: 'Type of relationship',
    example: 'same_organization',
    default: 'same_organization'
  })
  @IsOptional()
  relationshipType?: string;
}

export class CreateMultiEntityDto {
  @ApiProperty({
    description: 'Array of entities to create with comprehensive examples for each type',
    type: [EntityDataDto],
    example: [
      {
        entityType: 'organization',
        data: {
          name: 'TechHub Abeokuta',
          description: 'A leading tech hub in Abeokuta providing incubation services and training programs.',
          subcategory: 'Tech hub/training center',
          location: {
            url: 'https://maps.google.com/maps?q=7.1557,3.3451',
            address: '123 Tech Street, Abeokuta, Ogun State',
            latitude: 7.1557,
            longitude: 3.3451,
            city: 'Abeokuta',
            state_province: 'Ogun',
            country: 'Nigeria',
            postal_code: '110001'
          },
          website: 'https://techhubabeokuta.com',
          email: 'contact@techhubabeokuta.com',
          phone_number: '+2348012345678',
          logo: 'https://example.com/logo.png',
          services_offered: ['Incubation', 'Training Programs', 'Mentorship'],
          target_audience: ['Startups', 'Students', 'Professionals']
        }
      },
      {
        entityType: 'startup',
        data: {
          name: 'TechStartup Inc.',
          description: 'A fintech startup revolutionizing digital payments.',
          category: 'FinTech',
          location: {
            url: 'https://maps.google.com/maps?q=6.5244,3.3792',
            address: '123 Startup Street, Lagos',
            latitude: 6.5244,
            longitude: 3.3792,
            city: 'Lagos',
            state_province: 'Lagos',
            country: 'Nigeria',
            postal_code: '100001'
          },
          information: {
            address: '123 Startup Street, Lagos',
            url: 'https://maps.google.com/maps?q=6.5244,3.3792',
            latitude: 6.5244,
            longitude: 3.3792,
            city: 'Lagos',
            state_province: 'Lagos',
            country: 'Nigeria',
            postal_code: '100001',
            socialMedia: {
              website: 'https://techstartup.com',
              facebook: 'https://facebook.com/techstartup',
              instagram: 'https://instagram.com/techstartup',
              twitter: 'https://twitter.com/techstartup',
              linkedIn: 'https://linkedin.com/company/techstartup',
              youTube: 'https://youtube.com/techstartup'
            },
            phoneNumber: '+2348012345678',
            email: 'info@techstartup.com'
          },
          logo: 'https://example.com/startup-logo.png'
        }
      },
      {
        entityType: 'event',
        data: {
          title: 'Tech Conference 2024',
          description: 'Join us for the biggest tech conference of the year.',
          type: 'In-Person',
          category: 'Conference',
          date_time: {
            startDate: '2024-03-15T09:00:00.000Z',
            endDate: '2024-03-15T18:00:00.000Z'
          },
          location: {
            url: 'https://maps.google.com/maps?q=6.5244,3.3792',
            address: '123 Conference Street, Lagos',
            latitude: 6.5244,
            longitude: 3.3792,
            city: 'Lagos',
            state_province: 'Lagos',
            country: 'Nigeria',
            postal_code: '100001'
          },
          organizer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone_number: '+2348012345678',
            website: 'https://organizer.com'
          },
          about_event: '<h1>Tech Conference 2024</h1><p>Join industry leaders for networking and insights.</p>',
          pricing: 5000,
          registration_url: 'https://eventbrite.com/e/tech-conference-2024'
        }
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntityDataDto)
  entities: EntityDataDto[];

  @ApiPropertyOptional({
    description: 'Whether to create relationships between entities',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  createRelationships?: boolean;

  @ApiPropertyOptional({
    description: 'Custom relationships to create (optional)',
    type: [RelationshipDataDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelationshipDataDto)
  customRelationships?: RelationshipDataDto[];
} 