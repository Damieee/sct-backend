import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Startup } from './entities/startup.entity';

@Injectable()
export class StartupRepository extends Repository<Startup> {
  constructor(private dataSource: DataSource) {
    super(Startup, dataSource.createEntityManager());
  }
}
