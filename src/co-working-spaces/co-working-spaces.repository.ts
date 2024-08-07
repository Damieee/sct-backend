import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CoWorkingSpace } from './entities/co-working-space.entity';

@Injectable()
export class CoWorkingSpaceRepository extends Repository<CoWorkingSpace> {
  constructor(private dataSource: DataSource) {
    super(CoWorkingSpace, dataSource.createEntityManager());
  }
}
