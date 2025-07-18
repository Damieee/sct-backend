import { IsString, IsNotEmpty, IsNumber, IsUrl, MinLength, MaxLength, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({
    description: 'Google Maps URL or location URL',
    example: 'https://maps.google.com/maps?q=7.1557,3.3451'
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Full address of the organization',
    example: '123 Tech Street, Abeokuta, Ogun State'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  address: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 7.1557
  })
  @IsNumber()
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 3.3451
  })
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'City name',
    example: 'Abeokuta'
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'State or province',
    example: 'Ogun'
  })
  @IsString()
  @IsNotEmpty()
  state_province: string;

  @ApiProperty({
    description: 'Country name',
    example: 'Nigeria'
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Postal code',
    example: '110001'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(10)
  postal_code: string;
} 