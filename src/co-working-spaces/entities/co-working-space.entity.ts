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
export class CoWorkingSpace {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column()
  pricing_range: string;

  @ApiProperty()
  @Column('json')
  facilities: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @ApiProperty()
  @Column()
  logo: string;

  @ApiProperty()
  @Column('json')
  contact_info: string;

  @ManyToOne(() => User, (user) => user.coWorkingSpaces, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
