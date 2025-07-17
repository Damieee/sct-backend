import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EntityType } from '../../auth/entity-type.enum';

export class GetUnifiedEntitiesByTypeDto {
  @ApiProperty({
    description: 'Entity type to filter by',
    enum: EntityType,
    example: EntityType.STARTUPS,
    examples: {
      events: { value: EntityType.EVENTS, summary: 'Get all events' },
      startups: { value: EntityType.STARTUPS, summary: 'Get all startups' },
      coWorkingSpaces: { value: EntityType.CO_WORKING_SPACES, summary: 'Get all coworking spaces' },
      trainingOrganizations: { value: EntityType.TRAINING_ORGANIZATIONS, summary: 'Get all training organizations' },
      newsArticles: { value: EntityType.NEWS_ARTICLES, summary: 'Get all news articles' },
    },
  })
  @IsEnum(EntityType)
  entityType: EntityType;
} 