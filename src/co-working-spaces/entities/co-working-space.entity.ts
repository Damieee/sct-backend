import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/user.entity';
import { File } from 'src/files/entities/file.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class CoWorkingSpace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  daily_rate: number;

  @Column('json')
  opening_hour: {
    week_start: string;
    week_end: string;
    opening_time: string;
    closing_time: string;
  };

  @Column('json')
  facilities: string;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ default: 0 })
  ratingsCount: number;

  @Column()
  website: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @ManyToOne(() => User, (user) => user.coWorkingSpaces, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  user: User;

  @JoinColumn()
  @OneToOne(() => File, { eager: true, nullable: true })
  picture?: File;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
