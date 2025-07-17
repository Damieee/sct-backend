import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UnifiedEntity } from './unified-entity.entity';
import { EntityType } from '../auth/entity-type.enum';

@Injectable()
export class UnifiedEntityRepository extends Repository<UnifiedEntity> {
  constructor(private dataSource: DataSource) {
    super(UnifiedEntity, dataSource.createEntityManager());
  }

  async findByEntityType(entityType: EntityType): Promise<UnifiedEntity[]> {
    return this.find({
      where: { entityType },
      relations: ['user', 'pictures'],
    });
  }

  async findByIdAndEntityType(
    id: string,
    entityType: EntityType,
  ): Promise<UnifiedEntity | null> {
    return this.findOne({
      where: { id, entityType },
      relations: ['user', 'pictures'],
    });
  }
} 