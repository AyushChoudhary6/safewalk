import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

export enum EscortRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('escort_requests')
export class EscortRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50, default: EscortRequestStatus.PENDING })
  status: EscortRequestStatus;

  @Column('decimal', { precision: 10, scale: 8 })
  pickupLatitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  pickupLongitude: number;

  @Column('decimal', { precision: 10, scale: 8 })
  dropoffLatitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  dropoffLongitude: number;

  @Column('text', { nullable: true })
  additionalNotes: string;

  @Column('datetime', { nullable: true })
  acceptedAt: Date;

  @Column('datetime', { nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.escortRequests, {
    onDelete: 'CASCADE',
  })
  requester: User;

  @Column('uuid')
  requesterId: string;

  @ManyToOne(() => User, (user) => user.escortMatches, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  escort: User;

  @Column('uuid', { nullable: true })
  escortId: string;
}
