import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from 'src/auth/user.entity';

@Entity()
export class EventBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Event, (event) => event.bookmarks, {
    eager: true,
    onDelete: 'CASCADE',
  })
  event: Event;

  @ManyToOne(() => User, (user) => user.bookmarkedEvents, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
