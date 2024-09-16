import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { CoWorkingSpace } from './co-working-space.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => CoWorkingSpace,
    (coworkingSpace) => coworkingSpace.averageRating,
    {
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  @Exclude({ toPlainOnly: true })
  coworkingSpace: CoWorkingSpace;

  @Column({ type: 'int' })
  rating: number; // between 1-5

  @Column()
  userId: string; // Nullable because some users might not be signed up

  @CreateDateColumn()
  createdAt: Date;
}
