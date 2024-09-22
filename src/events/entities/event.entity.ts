import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/user.entity';
import { EventType } from '../event-type.enum';
import { File } from 'src/files/entities/file.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: EventType })
  type: EventType;

  @Column('json')
  date_time: {
    startDate: string;
    endDate: string;
  };

  @Column('json')
  location: {
    address: string; // Example: "Island 4, North Pacific Ocean"
    url: string; // Example: "http://maps.google.com/..."
    latitude: number;
    longitude: number;
    city: string;
    state_province: string;
    country: string;
    postal_code: string;
  };

  @Column({ type: 'varchar', nullable: true })
  thumbnail_image?: string;

  @Column({ type: 'int', nullable: true })
  pricing?: number;

  @Column('json')
  organizer: {
    name: string; // Example: "Dare Ezekiel"
    email: string; // Example: "joshezekiel.dev@gmail.com"
    phone_number: string; // Example: "+234 906 453 1233"
    website?: string; // Optional field
  };

  @Column({ type: 'varchar', nullable: true })
  registration_url?: string;

  @Column('simple-json')
  offerings: string[]; // Example: ["Stickers", "Career Talk", "Food"]

  @OneToMany(() => File, (file) => file.event, {
    cascade: true,
    eager: true,
  })
  pictures: File[];

  @ManyToOne(() => User, (user) => user.events, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
