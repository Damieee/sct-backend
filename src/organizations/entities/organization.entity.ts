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
import { OrganizationSubcategory } from '../../shared/organization-subcategory.enum';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: OrganizationSubcategory,
  })
  subcategory: OrganizationSubcategory;

  @Column('json', { nullable: true })
  services_offered?: string[];

  @Column('json', { nullable: true })
  target_audience?: string[];

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

  @Column()
  website: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  logo: string;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ default: 0 })
  ratingsCount: number;

  @Column('json', { nullable: true })
  opening_hour?: {
    week_start: string;
    week_end: string;
    opening_time: string;
    closing_time: string;
  };

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ type: 'text', nullable: true })
  adminComment?: string;

  @ManyToOne(() => User, (user) => user.organizations, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => File, (file) => file.organization, {
    cascade: true,
    eager: true,
  })
  pictures: File[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 