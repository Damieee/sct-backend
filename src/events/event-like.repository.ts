import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventLike } from './entities/event-likes.entity';

@Injectable()
export class EventLikeRepository extends Repository<EventLike> {
  constructor(private dataSource: DataSource) {
    super(EventLike, dataSource.createEntityManager());
  }
}
