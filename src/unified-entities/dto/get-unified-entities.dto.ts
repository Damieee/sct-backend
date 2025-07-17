import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EntityType } from '../../auth/entity-type.enum';

export class GetUnifiedEntitiesDto {
  @ApiProperty({
    description: 'Entity type to filter by',
    enum: EntityType,
    example: EntityType.EVENTS,
    required: false,
  })
  @IsOptional()
  @IsEnum(EntityType)
  entityType?: EntityType;

  @ApiProperty({
    description: 'Search term to filter entities',
    example: 'tech conference',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Category to filter by',
    example: 'AI',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
} 