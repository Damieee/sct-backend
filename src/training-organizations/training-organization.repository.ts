import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrganizationRating } from './entities/training-organization-rating.entity';

@Injectable()
export class RatingRepository extends Repository<OrganizationRating> {
  constructor(private dataSource: DataSource) {
    super(OrganizationRating, dataSource.createEntityManager());
  }
}
