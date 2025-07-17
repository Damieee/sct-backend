import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { UnifiedEntity } from '../unified-entity.entity';
import { User } from 'src/auth/user.entity';

@Entity()
export class UnifiedEntityLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UnifiedEntity, (unifiedEntity) => unifiedEntity.likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  unifiedEntity: UnifiedEntity;

  @ManyToOne(() => User, (user) => user.likedUnifiedEntities, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
} 