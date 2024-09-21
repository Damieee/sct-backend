import { CoWorkingSpace } from 'src/co-working-spaces/entities/co-working-space.entity';
import { Event } from 'src/events/entities/event.entity';
import { NewsArticle } from 'src/news-articles/entities/news-article.entity';
import { Startup } from 'src/startups/entities/startup.entity';
import { TrainingOrganization } from 'src/training-organizations/entities/training-organization.entity';
import {
  Column,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public url: string;

  @Column()
  public key: string;

  @ManyToOne(
    () => CoWorkingSpace,
    (coworkingspace) => coworkingspace.pictures,
    {
      onDelete: 'CASCADE',
    },
  )
  coworkingspace: CoWorkingSpace;

  @ManyToOne(() => Event, (event) => event.pictures, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @ManyToOne(() => NewsArticle, (newsarticle) => newsarticle.pictures, {
    onDelete: 'CASCADE',
  })
  newsarticle: NewsArticle;

  @ManyToOne(() => Startup, (startup) => startup.pictures, {
    onDelete: 'CASCADE',
  })
  startup: Startup;

  @ManyToOne(
    () => TrainingOrganization,
    (trainingorganization) => trainingorganization.pictures,
    {
      onDelete: 'CASCADE',
    },
  )
  trainingorganization: TrainingOrganization;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
