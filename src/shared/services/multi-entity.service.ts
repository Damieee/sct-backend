import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityRelationshipService } from './entity-relationship.service';
import { EntityType } from '../entity-type.enum';
import { User } from '../../auth/user.entity';

// Import all entity services
import { OrganizationsService } from '../../organizations/organizations.service';
import { StartupsService } from '../../startups/startups.service';
import { EventsService } from '../../events/events.service';
import { NewsArticlesService } from '../../news-articles/news-articles.service';
import { CoWorkingSpacesService } from '../../co-working-spaces/co-working-spaces.service';

export interface CreatedEntity {
  id: string;
  entityType: EntityType;
  data: any;
}

export interface MultiEntityResult {
  entities: CreatedEntity[];
  relationships: any[];
  message: string;
}

@Injectable()
export class MultiEntityService {
  constructor(
    private readonly entityRelationshipService: EntityRelationshipService,
    private readonly organizationsService: OrganizationsService,
    private readonly startupsService: StartupsService,
    private readonly eventsService: EventsService,
    private readonly newsArticlesService: NewsArticlesService,
    private readonly coWorkingSpacesService: CoWorkingSpacesService,
  ) {}

  async createMultiEntity(
    entities: Array<{ entityType: EntityType; data: Record<string, any> }>,
    createRelationships: boolean = true,
    customRelationships: Array<{ primaryEntityId: string; entityType: EntityType; relationshipType?: string }> = [],
    user: User,
  ): Promise<MultiEntityResult> {
    const createdEntities: CreatedEntity[] = [];
    const relationships: any[] = [];

    try {
      // Step 1: Create all entities
      for (const entity of entities) {
        const createdEntity = await this.createSingleEntity(entity.entityType, entity.data, user);
        createdEntities.push({
          id: createdEntity.id,
          entityType: entity.entityType,
          data: createdEntity,
        });
      }

      // Step 2: Create relationships if requested
      if (createRelationships && createdEntities.length > 1) {
        // Create relationships between all created entities
        for (let i = 0; i < createdEntities.length; i++) {
          for (let j = i + 1; j < createdEntities.length; j++) {
            const relationship = await this.entityRelationshipService.createRelationship(
              createdEntities[i].id,
              createdEntities[i].entityType,
              createdEntities[j].id,
              createdEntities[j].entityType,
              'same_organization',
            );
            relationships.push(relationship);
          }
        }
      }

      // Step 3: Create custom relationships if provided
      for (const customRel of customRelationships) {
        const relationship = await this.entityRelationshipService.createRelationship(
          customRel.primaryEntityId,
          customRel.entityType,
          createdEntities[0].id, // Link to first created entity
          createdEntities[0].entityType,
          customRel.relationshipType || 'same_organization',
        );
        relationships.push(relationship);
      }

      return {
        entities: createdEntities,
        relationships,
        message: `Successfully created ${createdEntities.length} entities with ${relationships.length} relationships`,
      };
    } catch (error) {
      // If any entity creation fails, we should ideally rollback
      throw new BadRequestException(`Failed to create multi-entity: ${error.message}`);
    }
  }

  private async createSingleEntity(
    entityType: EntityType,
    data: Record<string, any>,
    user: User,
  ): Promise<any> {
    switch (entityType) {
      case EntityType.ORGANIZATION:
        return await this.organizationsService.create(data as any, user);

      case EntityType.STARTUP:
        return await this.startupsService.createStartup(data as any, user);

      case EntityType.EVENT:
        return await this.eventsService.createEvent(data as any, user);

      case EntityType.NEWS_ARTICLE:
        return await this.newsArticlesService.createNewsArticle(data as any, user);

      case EntityType.CO_WORKING_SPACE:
        return await this.coWorkingSpacesService.createCoworkingspace(data as any, user);

      default:
        throw new BadRequestException(`Unsupported entity type: ${entityType}`);
    }
  }

  async getEntityService(entityType: EntityType) {
    switch (entityType) {
      case EntityType.ORGANIZATION:
        return this.organizationsService;
      case EntityType.STARTUP:
        return this.startupsService;
      case EntityType.EVENT:
        return this.eventsService;
      case EntityType.NEWS_ARTICLE:
        return this.newsArticlesService;
      case EntityType.CO_WORKING_SPACE:
        return this.coWorkingSpacesService;
      default:
        throw new BadRequestException(`Unsupported entity type: ${entityType}`);
    }
  }

  async getRelatedEntities(entityId: string, entityType: EntityType) {
    return await this.entityRelationshipService.getRelatedEntities(entityId, entityType);
  }
} 