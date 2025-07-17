import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UnifiedEntityBookmark } from './entities/unified-entity-bookmark.entity';

@Injectable()
export class UnifiedEntityBookmarkRepository extends Repository<UnifiedEntityBookmark> {
  constructor(private dataSource: DataSource) {
    super(UnifiedEntityBookmark, dataSource.createEntityManager());
  }
} 