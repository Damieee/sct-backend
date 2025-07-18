import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/user.entity';
import { File } from '../../files/entities/file.entity';
import { Status } from '../../enums/status.enum';
import { Exclude } from 'class-transformer';
@Entity()
export class CoWorkingSpace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('json')
  location: {
    address: string;
    url: string;
    latitude: number;
    longitude: number;
    city: string;
    state_province: string;
    country: string;
    postal_code: string;
  };

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

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ type: 'text', nullable: true })
  adminComment?: string;

  @Column('float', { array: true, nullable: false })
  @Exclude()
  embedding: number[];

  @ManyToOne(() => User, (user) => user.coWorkingSpaces, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => File, (file) => file.coworkingspace, {
    cascade: true,
    eager: true,
  })
  pictures: File[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
