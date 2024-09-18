import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/user.entity';

@Entity()
export class TrainingOrganization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column('simple-json')
  courses: string[];

  @Column()
  logo: string;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ default: 0 })
  ratingsCount: number;

  @Column('json')
  opening_hour: {
    week_start: string;
    week_end: string;
    opening_time: string;
    closing_time: string;
  };

  @Column()
  website: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @ManyToOne(() => User, (user) => user.trainingOrganizations, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
