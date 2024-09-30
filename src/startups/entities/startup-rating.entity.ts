import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Startup } from './startup.entity';

@Entity()
export class StartupRating {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Startup, (startup) => startup.averageRating, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  startup: Startup;

  @Column({ type: 'int' })
  rating: number;

  @Column()
  review: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
