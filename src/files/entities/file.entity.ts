import { CoWorkingSpace } from 'src/co-working-spaces/entities/co-working-space.entity';
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
