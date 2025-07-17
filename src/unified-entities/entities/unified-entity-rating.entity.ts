import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UnifiedEntity } from '../unified-entity.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class UnifiedEntityRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UnifiedEntity, (unifiedEntity) => unifiedEntity.averageRating, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  unifiedEntity: UnifiedEntity;

  @Column({ type: 'int' })
  rating: number; // between 1-5

  @Column()
  review: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
} 