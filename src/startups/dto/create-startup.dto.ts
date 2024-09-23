import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { Category } from '../category.enum';
import { Type } from 'class-transformer';

class SocialMedia {
  @ApiProperty({
    description: 'Website URL',
    example: 'https://www.secondarycity.tech/',
  })
  @IsString()
  @IsOptional()
  website: string;

  @ApiProperty({
    description: 'Facebook Page URL',
    example: 'https://facebook.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  facebook: string;

  @ApiProperty({
    description: 'Instagram Page URL',
    example: 'https://instagram.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  instagram: string;

  @ApiProperty({
    description: 'Twitter Handle URL',
    example: 'https://x.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  twitter: string;

  @ApiProperty({
    description: 'LinkedIn Page URL',
    example: 'https://linkedin.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  linkedIn: string;

  @ApiProperty({
    description: 'YouTube Channel URL',
    example: 'https://youtube.com/secondarycity',
  })
  @IsString()
  @IsOptional()
  youTube: string;
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
class Information {
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

  @ApiProperty({
    description: 'Contact Information',
  })
  socialMedia: SocialMedia;

  @ApiProperty({
    description: 'Phone Number',
    example: '+1 555 123 4567',
  })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    description: 'Email Address',
    example: 'info@secondarycity.tech',
  })
  @IsEmail()
  @IsOptional()
  email: string;
}

export class CreateStartupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'More Information of the Startup' })
  @ValidateNested({ each: true })
  @Type(() => Information)
  information: Information;

  @ApiProperty({ description: 'Location details' })
  @ValidateNested({ each: true })
  @Type(() => Location)
  location: Location;

  @ApiProperty()
  @IsOptional()
  tags: JSON;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ enum: Category })
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
