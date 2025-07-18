import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { MultiEntityService } from '../shared/services/multi-entity.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { GetOrganizationDto } from './dto/get-organization.dto';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { CreateMultiEntityDto } from './dto/create-multi-entity.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';
import { EntityType } from '../shared/entity-type.enum';
import { Status } from '../enums/status.enum';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBearerAuth,
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly multiEntityService: MultiEntityService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ 
    summary: 'Create a new organization',
    description: 'Create a new organization with the provided details'
  })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Organization created successfully',
    type: CreateOrganizationDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation error' 
  })
  create(@Body() createOrganizationDto: CreateOrganizationDto, @GetUser() user) {
    return this.organizationsService.create(createOrganizationDto, user);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all organizations',
    description: 'Retrieve all organizations with optional filtering'
  })
  @ApiQuery({ 
    name: 'subcategory', 
    description: 'Filter by organization subcategory',
    enum: ['Tech hub/training center', 'Coworking Space', 'Tech Community', 'Innovation Lab/Accelerator', 'Business Support/Digital Services', 'Development Partner', 'Government Org/Agency'],
    required: false
  })
  @ApiQuery({ 
    name: 'status', 
    description: 'Filter by organization status',
    enum: ['pending', 'published', 'Not Accepted'],
    required: false
  })
  @ApiQuery({ 
    name: 'includeRelated', 
    description: 'Include related entities',
    type: 'boolean',
    required: false
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Organizations retrieved successfully',
    type: [CreateOrganizationDto]
  })
  findAll(@Query() query: GetOrganizationDto) {
    return this.organizationsService.findAll(query);
  }

  @Get('my-organizations')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ 
    summary: 'Get my organizations',
    description: 'Retrieve all organizations created by the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User organizations retrieved successfully',
    type: [CreateOrganizationDto]
  })
  findMyOrganizations(@GetUser() user) {
    return this.organizationsService.findByUserId(user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get organization by ID',
    description: 'Retrieve a specific organization by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Organization retrieved successfully',
    type: CreateOrganizationDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Organization not found' 
  })
  findOne(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @Get(':id/related-entities')
  @ApiOperation({ 
    summary: 'Get related entities for an organization',
    description: 'Retrieve all entities related to a specific organization by entity type'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({ 
    name: 'entityType', 
    description: 'Type of entity to retrieve',
    enum: EntityType,
    example: EntityType.STARTUP,
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Related entities retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          primary_entity_id: { type: 'string' },
          primary_entity_type: { type: 'string', enum: Object.values(EntityType) },
          related_entity_id: { type: 'string' },
          related_entity_type: { type: 'string', enum: Object.values(EntityType) },
          relationship_type: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  getRelatedEntities(@Param('id') id: string, @Query('entityType') entityType: EntityType) {
    return this.organizationsService.getRelatedEntities(id, entityType);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.organizationsService.delete(id);
  }

  // Relationship endpoints
  @Post('relationships')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ 
    summary: 'Create entity relationship',
    description: 'Create a relationship between two entities'
  })
  @ApiBody({ type: CreateRelationshipDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Relationship created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid entity types or IDs' 
  })
  createRelationship(@Body() createRelationshipDto: CreateRelationshipDto) {
    return this.organizationsService.createRelationship(
      createRelationshipDto.primaryEntityId,
      createRelationshipDto.primaryEntityType,
      createRelationshipDto.relatedEntityId,
      createRelationshipDto.relatedEntityType,
      createRelationshipDto.relationshipType,
    );
  }

  @Delete('relationships/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteRelationship(@Param('id') id: string) {
    return this.organizationsService.deleteRelationship(id);
  }

  // Multi-entity creation endpoint
  @Post('multi-entity')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ 
    summary: 'Create multiple entities with relationships',
    description: `🎯 **Create multiple entities in a single API call!**
    
    **Supported Entity Types:**
    - 🏢 **Organization**: Tech hubs, training centers, coworking spaces
    - 🚀 **Startup**: Tech companies and innovative businesses  
    - 📅 **Event**: Conferences, meetups, workshops
    - 📰 **News Article**: Tech news and articles
    - 🏢 **Co-working Space**: Shared workspaces
    
    **Features:**
    - ✅ Create any combination of entities
    - ✅ Automatic relationship creation between entities
    - ✅ Comprehensive validation for each entity type
    - ✅ All required fields documented with examples
    - ✅ Dropdown-friendly enum values for categories
    
    **Frontend Developer Tips:**
    - Use dropdowns for entityType, categories, and enums
    - Location data is required for most entities
    - All examples include complete data structures
    - Relationships are created automatically between all entities`
  })
  @ApiBody({ 
    type: CreateMultiEntityDto,
    description: `📋 **Request Body Structure**
    
    **Required Fields:**
    - entities: Array of entities to create
    - Each entity must have entityType and data
    
    **Optional Fields:**
    - createRelationships: Boolean (default: true)
    - customRelationships: Array of custom relationships
    
    **Entity Type Options:**
    - organization: Tech hubs, training centers
    - startup: Tech companies, innovative businesses
    - event: Conferences, meetups, workshops
    - news_article: Tech news and articles
    - co_working_space: Shared workspaces
    
    **Category Options (per entity type):**
    - Organizations: Tech hub/training center, Coworking Space, Tech Community, etc.
    - Startups: FinTech, EdTech, Healthcare, AI, etc.
    - Events: Conference, App Launch, Hangout, Music
    - News: All tech categories
    - Co-working: Coworking Space category`
  })
  @ApiResponse({ 
    status: 201, 
    description: '✅ Multiple entities created successfully with relationships',
    schema: {
      type: 'object',
      properties: {
        entities: {
          type: 'array',
          description: 'Array of created entities with their IDs and data',
          items: {
            type: 'object',
            properties: {
              id: { 
                type: 'string',
                description: 'Unique identifier for the created entity',
                example: '123e4567-e89b-12d3-a456-426614174000'
              },
              entityType: { 
                type: 'string', 
                enum: ['organization', 'startup', 'event', 'news_article', 'co_working_space'],
                description: 'Type of the created entity'
              },
              data: { 
                type: 'object',
                description: 'Complete entity data as stored in database'
              }
            }
          }
        },
        relationships: {
          type: 'array',
          description: 'Array of relationships created between entities',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'string' },
              primary_entity_id: { type: 'string' },
              primary_entity_type: { type: 'string' },
              related_entity_id: { type: 'string' },
              related_entity_type: { type: 'string' },
              relationship_type: { type: 'string' }
            }
          }
        },
        message: { 
          type: 'string',
          description: 'Success message with entity and relationship counts',
          example: 'Successfully created 3 entities with 3 relationships'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: '❌ Bad request - Check the error message for specific validation issues. Common issues: missing location data, invalid enum values, required fields not provided.' 
  })
  async createMultiEntity(@Body() createMultiEntityDto: CreateMultiEntityDto, @GetUser() user) {
    const { entities, createRelationships = true, customRelationships = [] } = createMultiEntityDto;
    
    return await this.multiEntityService.createMultiEntity(
      entities,
      createRelationships,
      customRelationships,
      user
    );
  }
} 