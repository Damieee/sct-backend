import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TrainingOrganization } from './entities/training-organization.entity';

@Injectable()
export class TrainingOrganizationRepository extends Repository<TrainingOrganization> {
  constructor(private dataSource: DataSource) {
    super(TrainingOrganization, dataSource.createEntityManager());
  }
}
