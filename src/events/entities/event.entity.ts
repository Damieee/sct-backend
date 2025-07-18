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
import { EventType } from '../event-type.enum';
import { File } from '../../files/entities/file.entity';
import { Category } from '../category.enum';
import { EventLike } from './event-likes.entity';
import { EventBookmark } from './event-bookmarks.entity';
import { Status } from 'src/enums/status.enum';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: EventType })
  type: EventType;

  @Column('json')
  date_time: {
    startDate: string;
    endDate: string;
  };

  @Column('json')
  location: {
    address: string; // Example: "Island 4, North Pacific Ocean"
    url: string; // Example: "http://maps.google.com/..."
    latitude: number;
    longitude: number;
    city: string;
    state_province: string;
    country: string;
    postal_code: string;
  };

  @Column({ type: 'varchar', nullable: true })
  thumbnail_image?: string;

  @Column({ type: 'int', nullable: true })
  pricing?: number;

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

  @Column('json')
  organizer: {
    name: string; // Example: "Dare Ezekiel"
    email: string; // Example: "joshezekiel.dev@gmail.com"
    phone_number: string; // Example: "+234 906 453 1233"
    website?: string; // Optional field
  };

  @Column({ type: 'varchar', nullable: true })
  registration_url?: string;

  @Column({ type: 'text' })
  about_event: string;

  @OneToMany(() => File, (file) => file.event, {
    cascade: true,
    eager: true,
  })
  pictures: File[];

  @ManyToOne(() => User, (user) => user.events, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => EventLike, (eventLike) => eventLike.event)
  likes: EventLike[];

  @OneToMany(() => EventBookmark, (eventBookmark) => eventBookmark.event)
  bookmarks: EventBookmark[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
