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
import { Category } from '../category.enum';
import { File } from 'src/files/entities/file.entity';
import { Status } from 'src/enums/status.enum';

@Entity()
export class Startup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('json')
  information: {
    socialMedia: {
      website?: string;
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedIn?: string;
      youTube?: string;
    };
    phoneNumber?: string;
    email?: string;
  };

  @Column('json')
  location: {
    url: string;
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state_province: string;
    country: string;
    postal_code: string;
  };

  @Column('json')
  tags: JSON;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ default: 0 })
  ratingsCount: number;

  @Column({
    type: 'enum',
    enum: Category,
    default: Category.OTHER,
  })
  category: Category;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ type: 'text', nullable: true })
  adminComment?: string;

  @Column()
  logo: string;

  @ManyToOne(() => User, (user) => user.startups, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => File, (file) => file.startup, {
    cascade: true,
    eager: true,
  })
  pictures: File[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
