import { CoWorkingSpace } from '../../co-working-spaces/entities/co-working-space.entity';
import { Event } from '../../events/entities/event.entity';
import { NewsArticle } from '../../news-articles/entities/news-article.entity';
import { Startup } from '../../startups/entities/startup.entity';
import { Organization } from '../../organizations/entities/organization.entity';
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
    () => Organization,
    (organization) => organization.pictures,
    {
      onDelete: 'CASCADE',
    },
  )
  organization: Organization;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
