import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { File } from '../files/entities/file.entity';
import { Status } from '../enums/status.enum';
import { EntityType } from '../auth/entity-type.enum';
import { Category } from '../events/category.enum';
import { EventType } from '../events/event-type.enum';
import { Weekdays } from '../co-working-spaces/weekdays.enum';
import { UnifiedEntityLike } from './entities/unified-entity-like.entity';
import { UnifiedEntityBookmark } from './entities/unified-entity-bookmark.entity';

@Entity()
export class UnifiedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Type identifier
  @Column({ type: 'enum', enum: EntityType })
  entityType: EntityType;

  // Common fields (nullable)
  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string; // For events and news articles

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string; // For startups, coworking spaces, training organizations

  @Column({ type: 'text', nullable: true })
  description?: string; // For startups, training organizations

  @Column({ type: 'text', nullable: true })
  content?: string; // For news articles

  @Column({ type: 'text', nullable: true })
  about_event?: string; // For events

  // Event specific fields
  @Column({ type: 'enum', enum: EventType, nullable: true })
  type?: EventType; // For events

  @Column('json', { nullable: true })
  date_time?: {
    startDate: string;
    endDate: string;
  }; // For events

  @Column({ type: 'varchar', nullable: true })
  thumbnail_image?: string; // For events

  @Column({ type: 'int', nullable: true })
  pricing?: number; // For events

  @Column('json', { nullable: true })
  organizer?: {
    name: string;
    email: string;
    phone_number: string;
    website?: string;
  }; // For events

  @Column({ type: 'varchar', nullable: true })
  registration_url?: string; // For events

  // Startup specific fields
  @Column('json', { nullable: true })
  information?: {
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
  }; // For startups

  @Column('json', { nullable: true })
  tags?: JSON; // For startups

  @Column({ type: 'varchar', nullable: true })
  logo?: string; // For startups and training organizations

  // CoWorking Space specific fields
  @Column({ type: 'int', nullable: true })
  daily_rate?: number; // For coworking spaces

  @Column('json', { nullable: true })
  opening_hour?: {
    week_start: Weekdays;
    week_end: Weekdays;
    opening_time: string;
    closing_time: string;
  }; // For coworking spaces and training organizations

  @Column({ type: 'text', nullable: true })
  facilities?: string; // For coworking spaces

  // Training Organization specific fields
  @Column('simple-json', { nullable: true })
  courses?: string[]; // For training organizations

  // News Article specific fields
  @Column({ type: 'varchar', nullable: true })
  image?: string; // For news articles

  // Common location field
  @Column('json', { nullable: true })
  location?: {
    address: string;
    url: string;
    latitude: number;
    longitude: number;
    city: string;
    state_province: string;
    country: string;
    postal_code: string;
  };

  // Contact fields (nullable)
  @Column({ type: 'varchar', nullable: true })
  website?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  phone_number?: string;

  // Category field
  @Column({ type: 'enum', enum: Category, nullable: true })
  category?: Category;

  // Rating fields (nullable)
  @Column({ type: 'float', default: 0, nullable: true })
  averageRating?: number;

  @Column({ default: 0, nullable: true })
  totalRatings?: number;

  @Column({ default: 0, nullable: true })
  ratingsCount?: number;

  // Status field
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ type: 'text', nullable: true })
  adminComment?: string;

  // Embedding field (for coworking spaces)
  @Column('float', { array: true, nullable: true })
  embedding?: number[];

  // Relationships
  @ManyToOne(() => User, (user) => user.unifiedEntities, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => File, (file) => file.unifiedEntity, {
    cascade: true,
    eager: true,
  })
  pictures: File[];

  @OneToMany(() => UnifiedEntityLike, (unifiedEntityLike) => unifiedEntityLike.unifiedEntity)
  likes: UnifiedEntityLike[];

  @OneToMany(() => UnifiedEntityBookmark, (unifiedEntityBookmark) => unifiedEntityBookmark.unifiedEntity)
  bookmarks: UnifiedEntityBookmark[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 