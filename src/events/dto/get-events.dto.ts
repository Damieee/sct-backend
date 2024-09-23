import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventType } from '../event-type.enum';
import { Type } from 'class-transformer';
import { Category } from '../category.enum';

export class filterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Search by Cost',
    example: 4500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pricing: number;

  @ApiProperty({
    description: 'Start date and time of the event (ISO 8601 format)',
    example: '2020-02-05T06:35:22.000Z',
    format: 'date-time', // This indicates ISO 8601 date-time format
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'Start date must be in ISO 8601 format' },
  )
  fromDate: string;

  @ApiProperty({
    description: 'End date and time of the event (ISO 8601 format)',
    example: '2020-02-05T09:35:22.000Z',
    format: 'date-time', // ISO 8601 format
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'End date must be in ISO 8601 format' },
  )
  toDate: string;

  @ApiProperty({
    description: 'Type of the Event',
    example: 'In-Person',
    enum: EventType,
  })
  @IsEnum(EventType)
  @IsOptional()
  type: EventType;

  @ApiProperty({
    description: 'Category of the Event',
    example: 'FinTech',
    enum: Category,
  })
  @IsEnum(Category)
  @IsOptional()
  category: Category;
}
