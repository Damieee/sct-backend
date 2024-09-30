import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventBookmark } from './entities/event-bookmarks.entity';

@Injectable()
export class EventBookmarkRepository extends Repository<EventBookmark> {
  constructor(private dataSource: DataSource) {
    super(EventBookmark, dataSource.createEntityManager());
  }
}
