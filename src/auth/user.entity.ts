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
import { Review } from '../reviews/entities/review.entity';
import { File } from 'src/files/entities/file.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

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

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
