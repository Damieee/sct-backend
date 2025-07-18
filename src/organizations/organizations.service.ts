import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { GetOrganizationDto } from './dto/get-organization.dto';
import { Organization } from './entities/organization.entity';
import { EntityType } from '../shared/entity-type.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class OrganizationsService {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    user: User,
  ): Promise<Organization> {
    const organization = await this.organizationsRepository.create({
      ...createOrganizationDto,
      user,
    });

    return organization;
  }

  async findAll(query: GetOrganizationDto): Promise<Organization[]> {
    return await this.organizationsRepository.findAll(
      query.subcategory,
      query.status,
      query.includeRelated,
    );
  }

  async findById(id: string): Promise<Organization> {
    const organization = await this.organizationsRepository.findById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findById(id);
    return await this.organizationsRepository.update(id, updateOrganizationDto);
  }

  async delete(id: string): Promise<void> {
    const organization = await this.findById(id);
    await this.organizationsRepository.delete(id);
  }

  async findByUserId(userId: string): Promise<Organization[]> {
    return await this.organizationsRepository.findByUserId(userId);
  }

  // Entity relationship methods
  async createRelationship(
    primaryEntityId: string,
    primaryEntityType: EntityType,
    relatedEntityId: string,
    relatedEntityType: EntityType,
    relationshipType?: string,
  ) {
    // Validate that both entities exist
    if (primaryEntityType === EntityType.ORGANIZATION) {
      await this.findById(primaryEntityId);
    }
    // Add validation for other entity types as needed

    return await this.organizationsRepository.createRelationship(
      primaryEntityId,
      primaryEntityType,
      relatedEntityId,
      relatedEntityType,
      relationshipType,
    );
  }

  async getRelatedEntities(entityId: string, entityType: EntityType) {
    return await this.organizationsRepository.getRelatedEntities(entityId, entityType);
  }

  async deleteRelationship(relationshipId: string): Promise<void> {
    await this.organizationsRepository.deleteRelationship(relationshipId);
  }

  // Helper method to create organization and related startup
  async createOrganizationWithStartup(
    organizationData: CreateOrganizationDto,
    startupData: any, // You'll need to define startup DTO
    user: User,
  ) {
    // Create organization
    const organization = await this.create(organizationData, user);

    // Create startup (you'll need to implement this in startup service)
    // const startup = await this.startupService.create(startupData, user);

    // Create relationship
    // await this.createRelationship(
    //   organization.id,
    //   EntityType.ORGANIZATION,
    //   startup.id,
    //   EntityType.STARTUP,
    //   'same_organization'
    // );

    return organization;
  }
} 