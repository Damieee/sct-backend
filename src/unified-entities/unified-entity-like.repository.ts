import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UnifiedEntityLike } from './entities/unified-entity-like.entity';

@Injectable()
export class UnifiedEntityLikeRepository extends Repository<UnifiedEntityLike> {
  constructor(private dataSource: DataSource) {
    super(UnifiedEntityLike, dataSource.createEntityManager());
  }
} 