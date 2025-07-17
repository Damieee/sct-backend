import { IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EntityType } from '../../auth/entity-type.enum';

export class GetUnifiedEntityByIdDto {
  @ApiProperty({
    description: 'The ID of the unified entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;
}

export class GetUnifiedEntityByTypeAndIdDto {
  @ApiProperty({
    description: 'Entity type',
    enum: EntityType,
    example: EntityType.STARTUPS,
  })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({
    description: 'The ID of the unified entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;
} 