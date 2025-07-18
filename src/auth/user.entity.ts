import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { CoWorkingSpace } from '../co-working-spaces/entities/co-working-space.entity';
import { Startup } from '../startups/entities/startup.entity';
import { NewsArticle } from '../news-articles/entities/news-article.entity';
import { File } from '../files/entities/file.entity';
import { Exclude } from 'class-transformer';
import { EventLike } from '../events/entities/event-likes.entity';
import { EventBookmark } from '../events/entities/event-bookmarks.entity';
import { Organization } from '../organizations/entities/organization.entity';

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
  @Exclude()
  isThirdPartyAuth: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  @Exclude()
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  resetPasswordExpires: Date;

  @JoinColumn()
  @OneToOne(() => File, { eager: true, nullable: true })
  public avatar?: File;

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

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

  @OneToMany(() => Organization, (organization) => organization.user)
  organizations: Organization[];
}
