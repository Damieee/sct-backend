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

class Information {
  @ApiProperty({
    description: 'Address Description',
    example: 'Island 4, North Pacific Ocean, Behind Atlantic Ocean',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Google Map Link',
    example: 'https://googlemap.com/secondarycity',
  })
  @IsString()
  @IsNotEmpty()
  mapLink: string;

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
