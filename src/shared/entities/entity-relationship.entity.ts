import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityType } from '../entity-type.enum';

@Entity()
export class EntityRelationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  primary_entity_id: string;

  @Column({
    type: 'enum',
    enum: EntityType,
  })
  primary_entity_type: EntityType;

  @Column()
  related_entity_id: string;

  @Column({
    type: 'enum',
    enum: EntityType,
  })
  related_entity_type: EntityType;

  @Column({ type: 'varchar', length: 100, default: 'same_organization' })
  relationship_type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 