import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingRepository extends Repository<Rating> {
  constructor(private dataSource: DataSource) {
    super(Rating, dataSource.createEntityManager());
  }
}
