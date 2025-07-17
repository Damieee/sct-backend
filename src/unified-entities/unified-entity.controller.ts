import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UnifiedEntityService } from './unified-entity.service';
import { CreateUnifiedEntityDto } from './dto/create-unified-entity.dto';
import { RateUnifiedEntityDto } from './dto/rate-unified-entity.dto';
import { GetUnifiedEntitiesDto } from './dto/get-unified-entities.dto';
import { GetUnifiedEntitiesByTypeDto } from './dto/get-unified-entities-by-type.dto';
import { UnifiedEntity } from './unified-entity.entity';
import { AuthGuard } from '@nestjs/passport';
import { EntityType } from '../auth/entity-type.enum';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@ApiTags('Unified Entities')
@Controller('unified-entities')
export class UnifiedEntityController {
  constructor(private readonly unifiedEntityService: UnifiedEntityService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new unified entity' })
  @ApiResponse({
    status: 201,
    description: 'The unified entity has been successfully created.',
    type: UnifiedEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createUnifiedEntityDto: CreateUnifiedEntityDto,
    @GetUser() user: User,
  ): Promise<UnifiedEntity> {
    return this.unifiedEntityService.create(createUnifiedEntityDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all unified entities' })
  @ApiQuery({ name: 'entityType', required: false, enum: EntityType, description: 'Filter by entity type' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term to filter entities' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiResponse({
    status: 200,
    description: 'Returns all unified entities.',
    type: [UnifiedEntity],
  })
  async findAll(@Query() query: GetUnifiedEntitiesDto): Promise<UnifiedEntity[]> {
    return this.unifiedEntityService.findAll(query);
  }

  @Get('by-type/:entityType')
  @ApiOperation({ summary: 'Get unified entities by type' })
  @ApiParam({
    name: 'entityType',
    enum: EntityType,
    description: 'Entity type to filter by',
    example: EntityType.STARTUPS,
    examples: {
      events: { value: EntityType.EVENTS, summary: 'Get all events' },
      startups: { value: EntityType.STARTUPS, summary: 'Get all startups' },
      coWorkingSpaces: { value: EntityType.CO_WORKING_SPACES, summary: 'Get all coworking spaces' },
      trainingOrganizations: { value: EntityType.TRAINING_ORGANIZATIONS, summary: 'Get all training organizations' },
      newsArticles: { value: EntityType.NEWS_ARTICLES, summary: 'Get all news articles' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns unified entities of the specified type.',
    type: [UnifiedEntity],
  })
  @ApiResponse({ status: 400, description: 'Invalid entity type.' })
  async findByEntityType(
    @Param('entityType') entityType: EntityType,
  ): Promise<UnifiedEntity[]> {
    return this.unifiedEntityService.findByEntityType(entityType);
  }

  @Get(':unifiedEntityId/ratings')
  @ApiOperation({ summary: 'Get Unified Entity Ratings and Reviews' })
  @ApiParam({
    name: 'unifiedEntityId',
    description: 'The ID of the unified entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the ratings and reviews for the unified entity.',
  })
  @ApiResponse({ status: 404, description: 'Unified entity not found.' })
  async getUnifiedEntityRatingAndReviews(
    @Param('unifiedEntityId') unifiedEntityId: string,
  ) {
    return this.unifiedEntityService.getUnifiedEntityRatingAndReviews(unifiedEntityId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a unified entity by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the unified entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the unified entity.',
    type: UnifiedEntity,
  })
  @ApiResponse({ status: 404, description: 'Unified entity not found.' })
  async findOne(@Param('id') id: string): Promise<UnifiedEntity | null> {
    return this.unifiedEntityService.findOne(id);
  }

  @Get(':entityType/:id')
  @ApiOperation({ summary: 'Get a unified entity by type and ID' })
  @ApiParam({
    name: 'entityType',
    enum: EntityType,
    description: 'Entity type',
    example: EntityType.STARTUPS,
    examples: {
      events: { value: EntityType.EVENTS, summary: 'Get event by ID' },
      startups: { value: EntityType.STARTUPS, summary: 'Get startup by ID' },
      coWorkingSpaces: { value: EntityType.CO_WORKING_SPACES, summary: 'Get coworking space by ID' },
      trainingOrganizations: { value: EntityType.TRAINING_ORGANIZATIONS, summary: 'Get training organization by ID' },
      newsArticles: { value: EntityType.NEWS_ARTICLES, summary: 'Get news article by ID' },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the unified entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the unified entity of the specified type.',
    type: UnifiedEntity,
  })
  @ApiResponse({ status: 404, description: 'Unified entity not found.' })
  @ApiResponse({ status: 400, description: 'Invalid entity type.' })
  async findByIdAndEntityType(
    @Param('entityType') entityType: EntityType,
    @Param('id') id: string,
  ): Promise<UnifiedEntity | null> {
    return this.unifiedEntityService.findByIdAndEntityType(id, entityType);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':unifiedEntityId/like')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Like Unified Entity' })
  @ApiResponse({
    status: 200,
    description: 'Unified entity liked successfully.',
  })
  @ApiResponse({ status: 404, description: 'Unified entity not found.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to like unified entity.' })
  async likeUnifiedEntity(
    @Param('unifiedEntityId') unifiedEntityId: string,
    @GetUser() user: User,
  ) {
    return this.unifiedEntityService.likeUnifiedEntity(unifiedEntityId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':unifiedEntityId/unlike')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Unlike Unified Entity' })
  @ApiResponse({
    status: 200,
    description: 'Unified entity unliked successfully.',
  })
  @ApiResponse({ status: 404, description: 'Unified entity not found.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to unlike unified entity.' })
  async unlikeUnifiedEntity(
    @Param('unifiedEntityId') unifiedEntityId: string,
    @GetUser() user: User,
  ) {
    return this.unifiedEntityService.unlikeUnifiedEntity(unifiedEntityId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':unifiedEntityId/bookmark')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Bookmark Unified Entity' })
  @ApiResponse({
    status: 200,
    description: 'Unified entity bookmarked successfully.',
  })
  @ApiResponse({ status: 404, description: 'Unified entity not found.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to bookmark unified entity.' })
  async bookmarkUnifiedEntity(
    @Param('unifiedEntityId') unifiedEntityId: string,
    @GetUser() user: User,
  ) {
    return this.unifiedEntityService.bookmarkUnifiedEntity(unifiedEntityId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':unifiedEntityId/unbookmark')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Unbookmark Unified Entity' })
  @ApiResponse({
    status: 200,
    description: 'Unified entity unbookmarked successfully.',
  })
  @ApiResponse({ status: 404, description: 'Unified entity not found.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to unbookmark unified entity.' })
  async unbookmarkUnifiedEntity(
    @Param('unifiedEntityId') unifiedEntityId: string,
    @GetUser() user: User,
  ) {
    return this.unifiedEntityService.unbookmarkUnifiedEntity(unifiedEntityId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':unifiedEntityId/rate')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Rate Unified Entity' })
  @ApiResponse({
    status: 201,
    description: 'Unified entity rating has been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: RateUnifiedEntityDto })
  async rateUnifiedEntity(
    @Param('unifiedEntityId') unifiedEntityId: string,
    @Body() ratingDto: RateUnifiedEntityDto,
    @GetUser() user: User,
  ) {
    try {
      return this.unifiedEntityService.rateUnifiedEntity(unifiedEntityId, ratingDto, user);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

} 