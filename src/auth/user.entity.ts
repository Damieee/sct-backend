import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { TrainingOrganization } from '../training-organizations/entities/training-organization.entity';
import { CoWorkingSpace } from '../co-working-spaces/entities/co-working-space.entity';
import { Startup } from '../startups/entities/startup.entity';
import { NewsArticle } from '../news-articles/entities/news-article.entity';
import { File } from 'src/files/entities/file.entity';
import { Exclude } from 'class-transformer';
import { EventLike } from 'src/events/entities/event-likes.entity';
import { EventBookmark } from 'src/events/entities/event-bookmarks.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ default: false })
  isThirdPartyAuth: boolean;

  @JoinColumn()
  @OneToOne(() => File, { eager: true, nullable: true })
  public avatar?: File;

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(() => TrainingOrganization, (organization) => organization.user)
  trainingOrganizations: TrainingOrganization[];

  @OneToMany(() => CoWorkingSpace, (coWorkingSpace) => coWorkingSpace.user)
  coWorkingSpaces: CoWorkingSpace[];

  @OneToMany(() => Startup, (startup) => startup.user)
  startups: Startup[];

  @OneToMany(() => NewsArticle, (newsArticle) => newsArticle.user)
  newsArticles: NewsArticle[];

  @OneToMany(() => EventLike, (eventLike) => eventLike.user)
  likedEvents: EventLike[];

  @OneToMany(() => EventBookmark, (eventBookmark) => eventBookmark.user)
  bookmarkedEvents: EventBookmark[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
