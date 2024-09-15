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
import { Category } from '../category.enum';

@Entity()
export class Startup {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column('json')
  tags: JSON;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: Category,
    default: Category.OTHER, // Default value, if applicable
  })
  category: Category;

  @ApiProperty()
  @Column()
  logo: string;

  @ManyToOne(() => User, (user) => user.startups, {
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
