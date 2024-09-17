import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StartupRating } from './entities/startup-rating.entity';

@Injectable()
export class RatingRepository extends Repository<StartupRating> {
  constructor(private dataSource: DataSource) {
    super(StartupRating, dataSource.createEntityManager());
  }
}
