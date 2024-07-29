import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../events/entities/event.entity';
import { TrainingOrganization } from '../training-organizations/entities/training-organization.entity';
import { CoWorkingSpace } from '../co-working-spaces/entities/co-working-space.entity';
import { Startup } from '../startups/entities/startup.entity';
import { NewsArticle } from '../news-articles/entities/news-article.entity';
import { Review } from '../reviews/entities/review.entity';

@Entity()
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The username of the user' })
  @Column({ unique: true })
  username: string;

  @Column()
  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @OneToMany(() => Event, (event) => event.organizer)
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
