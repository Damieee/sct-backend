import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/user.entity';
import { File } from 'src/files/entities/file.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class CoWorkingSpace {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  website: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  phone_number: string;

  @ManyToOne(() => User, (user) => user.coWorkingSpaces, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  user: User;

  @ApiProperty()
  @JoinColumn()
  @OneToOne(() => File, { eager: true, nullable: true })
  picture?: File;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
