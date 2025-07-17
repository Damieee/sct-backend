import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { UnifiedEntityRepository } from './unified-entity.repository';
import { UnifiedEntityLikeRepository } from './unified-entity-like.repository';
import { UnifiedEntityBookmarkRepository } from './unified-entity-bookmark.repository';
import { UnifiedEntityRatingRepository } from './unified-entity-rating.repository';
import { CreateUnifiedEntityDto } from './dto/create-unified-entity.dto';
import { RateUnifiedEntityDto } from './dto/rate-unified-entity.dto';
import { GetUnifiedEntitiesDto } from './dto/get-unified-entities.dto';
import { UnifiedEntity } from './unified-entity.entity';
import { EntityType } from '../auth/entity-type.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class UnifiedEntityService {
  constructor(
    private unifiedEntityRepository: UnifiedEntityRepository,
    private unifiedEntityLikeRepository: UnifiedEntityLikeRepository,
    private unifiedEntityBookmarkRepository: UnifiedEntityBookmarkRepository,
    private unifiedEntityRatingRepository: UnifiedEntityRatingRepository,
  ) {}

  async create(
    createUnifiedEntityDto: CreateUnifiedEntityDto,
    user: User,
  ): Promise<UnifiedEntity> {
    // Validate that required fields are provided based on entity type
    this.validateEntityFields(createUnifiedEntityDto);

    const unifiedEntity = this.unifiedEntityRepository.create({
      ...createUnifiedEntityDto,
      user,
    });

    return this.unifiedEntityRepository.save(unifiedEntity);
  }

  async findAll(query?: GetUnifiedEntitiesDto): Promise<UnifiedEntity[]> {
    const queryBuilder = this.unifiedEntityRepository.createQueryBuilder('unifiedEntity')
      .leftJoinAndSelect('unifiedEntity.user', 'user')
      .leftJoinAndSelect('unifiedEntity.pictures', 'pictures');

    if (query?.entityType) {
      queryBuilder.andWhere('unifiedEntity.entityType = :entityType', { entityType: query.entityType });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(unifiedEntity.title ILIKE :search OR unifiedEntity.name ILIKE :search OR unifiedEntity.description ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query?.category) {
      queryBuilder.andWhere('unifiedEntity.category = :category', { category: query.category });
    }

    return queryBuilder.getMany();
  }

  async findByEntityType(entityType: EntityType): Promise<UnifiedEntity[]> {
    return this.unifiedEntityRepository.findByEntityType(entityType);
  }

  async findOne(id: string): Promise<UnifiedEntity | null> {
    return this.unifiedEntityRepository.findOne({
      where: { id },
      relations: ['user', 'pictures'],
    });
  }

  async findByIdAndEntityType(
    id: string,
    entityType: EntityType,
  ): Promise<UnifiedEntity | null> {
    return this.unifiedEntityRepository.findByIdAndEntityType(id, entityType);
  }

  private validateEntityFields(dto: CreateUnifiedEntityDto): void {
    const { entityType } = dto;

    switch (entityType) {
      case EntityType.EVENTS:
        this.validateEventFields(dto);
        break;
      case EntityType.STARTUPS:
        this.validateStartupFields(dto);
        break;
      case EntityType.CO_WORKING_SPACES:
        this.validateCoWorkingSpaceFields(dto);
        break;
      case EntityType.TRAINING_ORGANIZATIONS:
        this.validateTrainingOrganizationFields(dto);
        break;
      case EntityType.NEWS_ARTICLES:
        this.validateNewsArticleFields(dto);
        break;
      default:
        throw new BadRequestException(`Invalid entity type: ${entityType}`);
    }
  }

  private validateEventFields(dto: CreateUnifiedEntityDto): void {
    if (!dto.title) {
      throw new BadRequestException('Title is required for events');
    }
    if (!dto.about_event) {
      throw new BadRequestException('About event is required for events');
    }
    if (!dto.type) {
      throw new BadRequestException('Type is required for events');
    }
    if (!dto.date_time) {
      throw new BadRequestException('Date and time is required for events');
    }
    if (!dto.location) {
      throw new BadRequestException('Location is required for events');
    }
    if (!dto.organizer) {
      throw new BadRequestException('Organizer information is required for events');
    }
    if (!dto.category) {
      throw new BadRequestException('Category is required for events');
    }
  }

  private validateStartupFields(dto: CreateUnifiedEntityDto): void {
    if (!dto.name) {
      throw new BadRequestException('Name is required for startups');
    }
    if (!dto.description) {
      throw new BadRequestException('Description is required for startups');
    }
    if (!dto.location) {
      throw new BadRequestException('Location is required for startups');
    }
    if (!dto.category) {
      throw new BadRequestException('Category is required for startups');
    }
  }

  private validateCoWorkingSpaceFields(dto: CreateUnifiedEntityDto): void {
    if (!dto.name) {
      throw new BadRequestException('Name is required for coworking spaces');
    }
    if (!dto.location) {
      throw new BadRequestException('Location is required for coworking spaces');
    }
    if (!dto.daily_rate) {
      throw new BadRequestException('Daily rate is required for coworking spaces');
    }
    if (!dto.opening_hour) {
      throw new BadRequestException('Opening hours are required for coworking spaces');
    }
  }

  private validateTrainingOrganizationFields(dto: CreateUnifiedEntityDto): void {
    if (!dto.name) {
      throw new BadRequestException('Name is required for training organizations');
    }
    if (!dto.description) {
      throw new BadRequestException('Description is required for training organizations');
    }
    if (!dto.location) {
      throw new BadRequestException('Location is required for training organizations');
    }
    if (!dto.courses || dto.courses.length === 0) {
      throw new BadRequestException('Courses are required for training organizations');
    }
    if (!dto.opening_hour) {
      throw new BadRequestException('Opening hours are required for training organizations');
    }
  }

  private validateNewsArticleFields(dto: CreateUnifiedEntityDto): void {
    if (!dto.title) {
      throw new BadRequestException('Title is required for news articles');
    }
    if (!dto.content) {
      throw new BadRequestException('Content is required for news articles');
    }
    if (!dto.category) {
      throw new BadRequestException('Category is required for news articles');
    }
  }

  async likeUnifiedEntity(unifiedEntityId: string, user: User) {
    try {
      const unifiedEntity = await this.unifiedEntityRepository.findOne({
        where: { id: unifiedEntityId },
      });
      if (!unifiedEntity) {
        throw new NotFoundException(`Unified entity with ID ${unifiedEntityId} not found`);
      }
      if (!user) {
        throw new NotFoundException(`User with ID ${user.id} not found`);
      }
      
      // Check if user has already liked the unified entity
      const existingLike = await this.unifiedEntityLikeRepository.findOne({
        where: [{ unifiedEntity: { id: unifiedEntityId }, user }],
      });

      if (existingLike) {
        throw new Error('You have already liked this unified entity.');
      }
      
      const like = this.unifiedEntityLikeRepository.create({
        unifiedEntity: unifiedEntity,
        user,
      });

      await this.unifiedEntityLikeRepository.save(like);

      return like;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unlikeUnifiedEntity(unifiedEntityId: string, user: User) {
    try {
      const likedUnifiedEntity = await this.unifiedEntityLikeRepository.findOne({
        where: { unifiedEntity: { id: unifiedEntityId }, user },
      });

      if (!likedUnifiedEntity) {
        throw new NotFoundException('Unified entity not found or not liked');
      }

      await this.unifiedEntityLikeRepository.delete({
        unifiedEntity: { id: unifiedEntityId },
        user: { id: user.id },
      });
      return { message: 'Unified entity unliked successfully', status: 'success' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to unlike unified entity');
    }
  }

  async bookmarkUnifiedEntity(unifiedEntityId: string, user: User) {
    try {
      const unifiedEntity = await this.unifiedEntityRepository.findOne({
        where: { id: unifiedEntityId },
      });
      if (!unifiedEntity) {
        throw new NotFoundException(`Unified entity with ID ${unifiedEntityId} not found`);
      }
      if (!user) {
        throw new NotFoundException(`User with ID ${user.id} not found`);
      }
      
      // Check if user has already bookmarked the unified entity
      const existingBookmark = await this.unifiedEntityBookmarkRepository.findOne({
        where: [{ unifiedEntity: { id: unifiedEntityId }, user }],
      });
      
      if (existingBookmark) {
        throw new Error('You have already bookmarked this unified entity.');
      }
      
      const bookmark = this.unifiedEntityBookmarkRepository.create({
        unifiedEntity: unifiedEntity,
        user,
      });
      
      await this.unifiedEntityBookmarkRepository.save(bookmark);
      return bookmark;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unbookmarkUnifiedEntity(unifiedEntityId: string, user: User) {
    try {
      const bookmarkedUnifiedEntity = await this.unifiedEntityBookmarkRepository.findOne({
        where: { unifiedEntity: { id: unifiedEntityId }, user },
      });
      
      if (!bookmarkedUnifiedEntity) {
        throw new NotFoundException('Unified entity not found or not bookmarked');
      }
      
      await this.unifiedEntityBookmarkRepository.delete({
        unifiedEntity: { id: unifiedEntityId },
        user: { id: user.id },
      });
      return { message: 'Unified entity un-bookmarked successfully', status: 'success' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to unbookmark unified entity');
    }
  }

  async rateUnifiedEntity(
    unifiedEntityId: string,
    rateUnifiedEntityDto: RateUnifiedEntityDto,
    user: User,
  ) {
    try {
      const { rating, review } = rateUnifiedEntityDto;
      const userId = user.id;

      if (rating < 1 || rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5.');
      }

      // Check if user has already rated the unified entity
      const existingRating = await this.unifiedEntityRatingRepository.findOne({
        where: [{ unifiedEntity: { id: unifiedEntityId }, userId }],
      });

      if (existingRating) {
        throw new Error('You have already rated this unified entity.');
      }

      // Add new rating
      const unifiedEntity = await this.unifiedEntityRepository.findOne({
        where: { id: unifiedEntityId },
      });
      if (!unifiedEntity) {
        throw new Error('Unified entity not found.');
      }

      const newRating = this.unifiedEntityRatingRepository.create({
        unifiedEntity,
        rating,
        review,
        userId,
      });

      await this.unifiedEntityRatingRepository.save(newRating);

      // Update unified entity average rating
      unifiedEntity.totalRatings = (unifiedEntity.totalRatings || 0) + rating;
      unifiedEntity.ratingsCount = (unifiedEntity.ratingsCount || 0) + 1;
      unifiedEntity.averageRating = unifiedEntity.totalRatings / unifiedEntity.ratingsCount;

      await this.unifiedEntityRepository.save(unifiedEntity);

      return unifiedEntity;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUnifiedEntityRatingAndReviews(unifiedEntityId: string) {
    try {
      const ratings = await this.unifiedEntityRatingRepository.find({
        where: { unifiedEntity: { id: unifiedEntityId } },
        relations: ['unifiedEntity'],
      });

      const averageRating =
        ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        ratings.length;

      return {
        ratings,
        averageRating: isNaN(averageRating) ? 0 : averageRating,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 