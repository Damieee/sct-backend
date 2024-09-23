import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { TrainingOrganization } from './training-organization.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class OrganizationRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => TrainingOrganization,
    (trainingorganization) => trainingorganization.averageRating,
    {
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  @Exclude({ toPlainOnly: true })
  trainingorganization: TrainingOrganization;

  @Column({ type: 'int' })
  rating: number; // between 1-5

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
