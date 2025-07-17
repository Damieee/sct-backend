import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UnifiedEntityRating } from './entities/unified-entity-rating.entity';

@Injectable()
export class UnifiedEntityRatingRepository extends Repository<UnifiedEntityRating> {
  constructor(private dataSource: DataSource) {
    super(UnifiedEntityRating, dataSource.createEntityManager());
  }
} 