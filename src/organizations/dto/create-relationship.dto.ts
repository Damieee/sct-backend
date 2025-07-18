import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityType } from '../../shared/entity-type.enum';

export class CreateRelationshipDto {
  @ApiProperty({
    description: 'ID of the primary entity',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  primaryEntityId: string;

  @ApiProperty({
    description: 'Type of the primary entity',
    enum: EntityType,
    example: EntityType.ORGANIZATION
  })
  @IsEnum(EntityType)
  primaryEntityType: EntityType;

  @ApiProperty({
    description: 'ID of the related entity',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsString()
  @IsNotEmpty()
  relatedEntityId: string;

  @ApiProperty({
    description: 'Type of the related entity',
    enum: EntityType,
    example: EntityType.STARTUP
  })
  @IsEnum(EntityType)
  relatedEntityType: EntityType;

  @ApiPropertyOptional({
    description: 'Type of relationship',
    example: 'same_organization',
    default: 'same_organization'
  })
  @IsOptional()
  @IsString()
  relationshipType?: string;
} 