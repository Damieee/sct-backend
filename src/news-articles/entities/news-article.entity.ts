import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/user.entity';
import { Category } from '../category.enum';
import { File } from 'src/files/entities/file.entity';
import { Status } from 'src/enums/status.enum';

@Entity()
export class NewsArticle {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  content: string;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ type: 'text', nullable: true })
  adminComment?: string;

  @ManyToOne(() => User, (user) => user.newsArticles, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => File, (file) => file.newsarticle, {
    cascade: true,
    eager: true,
  })
  pictures: File[];

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
