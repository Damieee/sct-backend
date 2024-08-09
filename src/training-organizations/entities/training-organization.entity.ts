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
export class TrainingOrganization {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column()
  courses: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @ApiProperty()
  @Column()
  logo: string;

  @ApiProperty()
  @Column()
  contact_info: string;

  @ManyToOne(() => User, (user) => user.trainingOrganizations, {
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
