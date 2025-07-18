import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRelationship } from '../entities/entity-relationship.entity';
import { EntityType } from '../entity-type.enum';

@Injectable()
export class EntityRelationshipService {
  constructor(
    @InjectRepository(EntityRelationship)
    private readonly entityRelationshipRepository: Repository<EntityRelationship>,
  ) {}

  async createRelationship(
    primaryEntityId: string,
    primaryEntityType: EntityType,
    relatedEntityId: string,
    relatedEntityType: EntityType,
    relationshipType: string = 'same_organization',
  ): Promise<EntityRelationship> {
    const relationship = this.entityRelationshipRepository.create({
      primary_entity_id: primaryEntityId,
      primary_entity_type: primaryEntityType,
      related_entity_id: relatedEntityId,
      related_entity_type: relatedEntityType,
      relationship_type: relationshipType,
    });
    return await this.entityRelationshipRepository.save(relationship);
  }

  async getRelatedEntities(
    entityId: string,
    entityType: EntityType,
  ): Promise<EntityRelationship[]> {
    return await this.entityRelationshipRepository.find({
      where: [
        { primary_entity_id: entityId, primary_entity_type: entityType },
        { related_entity_id: entityId, related_entity_type: entityType },
      ],
    });
  }

  async deleteRelationship(id: string): Promise<void> {
    await this.entityRelationshipRepository.delete(id);
  }

  async deleteAllRelationshipsForEntity(
    entityId: string,
    entityType: EntityType,
  ): Promise<void> {
    await this.entityRelationshipRepository.delete({
      primary_entity_id: entityId,
      primary_entity_type: entityType,
    });
    await this.entityRelationshipRepository.delete({
      related_entity_id: entityId,
      related_entity_type: entityType,
    });
  }

  async findEntitiesByType(
    entityType: EntityType,
    includeRelated: boolean = false,
  ): Promise<EntityRelationship[]> {
    const query = this.entityRelationshipRepository.createQueryBuilder('relationship');

    if (includeRelated) {
      query.where('relationship.primary_entity_type = :entityType', { entityType })
        .orWhere('relationship.related_entity_type = :entityType', { entityType });
    } else {
      query.where('relationship.primary_entity_type = :entityType', { entityType });
    }

    return await query.getMany();
  }
} 