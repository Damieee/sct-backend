import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SpaceRating } from './entities/space-rating.entity';

@Injectable()
export class RatingRepository extends Repository<SpaceRating> {
  constructor(private dataSource: DataSource) {
    super(SpaceRating, dataSource.createEntityManager());
  }
}
