import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { UnifiedEntity } from '../unified-entity.entity';
import { User } from 'src/auth/user.entity';

@Entity()
export class UnifiedEntityBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UnifiedEntity, (unifiedEntity) => unifiedEntity.bookmarks, {
    eager: true,
    onDelete: 'CASCADE',
  })
  unifiedEntity: UnifiedEntity;

  @ManyToOne(() => User, (user) => user.bookmarkedUnifiedEntities, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
} 