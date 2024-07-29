import {
  Entity,
  PrimaryGeneratedColumn,
  Column, 
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/user.entity';

@Entity()
export class Event {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  date: string;

  @ApiProperty()
  @Column()
  time: string;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column()
  category: string;

  @ApiProperty()
  @Column()
  offerings: string;

  @ApiProperty()
  @Column()
  thumbnail_image: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @ManyToOne(() => User, (user) => user.events, {
    eager: true,
    onDelete: 'CASCADE',
  })
  organizer: User;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
