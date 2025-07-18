import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { EntityRelationshipService } from '../shared/services/entity-relationship.service';
import { EntityType } from '../shared/entity-type.enum';
import { OrganizationSubcategory } from '../shared/organization-subcategory.enum';
import { Status } from '../enums/status.enum';

@Injectable()
export class OrganizationsRepository {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly entityRelationshipService: EntityRelationshipService,
  ) {}

  async create(organization: Partial<Organization>): Promise<Organization> {
    const newOrganization = this.organizationRepository.create(organization);
    return await this.organizationRepository.save(newOrganization);
  }

  async findAll(
    subcategory?: OrganizationSubcategory,
    status?: Status,
    includeRelated?: boolean,
  ): Promise<Organization[]> {
    const query = this.organizationRepository.createQueryBuilder('organization');

    if (subcategory) {
      query.andWhere('organization.subcategory = :subcategory', { subcategory });
    }

    if (status) {
      query.andWhere('organization.status = :status', { status });
    }

    if (includeRelated) {
      query.leftJoinAndSelect('organization.pictures', 'pictures');
    }

    return await query.getMany();
  }

  async findById(id: string): Promise<Organization> {
    return await this.organizationRepository.findOne({
      where: { id },
      relations: ['pictures', 'user'],
    });
  }

  async update(id: string, updates: Partial<Organization>): Promise<Organization> {
    await this.organizationRepository.update(id, updates);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.organizationRepository.delete(id);
  }

  async findByUserId(userId: string): Promise<Organization[]> {
    return await this.organizationRepository.find({
      where: { user: { id: userId } },
      relations: ['pictures'],
    });
  }

  // Entity relationship methods
  async createRelationship(
    primaryEntityId: string,
    primaryEntityType: EntityType,
    relatedEntityId: string,
    relatedEntityType: EntityType,
    relationshipType: string = 'same_organization',
  ) {
    return await this.entityRelationshipService.createRelationship(
      primaryEntityId,
      primaryEntityType,
      relatedEntityId,
      relatedEntityType,
      relationshipType,
    );
  }

  async getRelatedEntities(
    entityId: string,
    entityType: EntityType,
  ) {
    return await this.entityRelationshipService.getRelatedEntities(entityId, entityType);
  }

  async deleteRelationship(id: string): Promise<void> {
    await this.entityRelationshipService.deleteRelationship(id);
  }
} 