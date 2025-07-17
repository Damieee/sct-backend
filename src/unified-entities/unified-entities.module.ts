import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnifiedEntity } from './unified-entity.entity';
import { UnifiedEntityLike } from './entities/unified-entity-like.entity';
import { UnifiedEntityBookmark } from './entities/unified-entity-bookmark.entity';
import { UnifiedEntityRating } from './entities/unified-entity-rating.entity';
import { UnifiedEntityRepository } from './unified-entity.repository';
import { UnifiedEntityLikeRepository } from './unified-entity-like.repository';
import { UnifiedEntityBookmarkRepository } from './unified-entity-bookmark.repository';
import { UnifiedEntityRatingRepository } from './unified-entity-rating.repository';
import { UnifiedEntityService } from './unified-entity.service';
import { UnifiedEntityController } from './unified-entity.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UnifiedEntity, UnifiedEntityLike, UnifiedEntityBookmark, UnifiedEntityRating]), AuthModule],
  controllers: [UnifiedEntityController],
  providers: [
    UnifiedEntityService, 
    UnifiedEntityRepository,
    UnifiedEntityLikeRepository,
    UnifiedEntityBookmarkRepository,
    UnifiedEntityRatingRepository,
  ],
  exports: [UnifiedEntityService, UnifiedEntityRepository],
})
export class UnifiedEntitiesModule {} 