import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  activityType: string; // 'WALK', 'REPORT', 'ESCORT_REQUEST', etc.

  @Column('decimal', { precision: 10, scale: 8 })
  startLatitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  startLongitude: number;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  endLatitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  endLongitude: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  distanceMeters: number;

  @Column('int', { default: 0 })
  durationSeconds: number;

  @Column('int', { default: 0 })
  incidentsEncountered: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  averageSafetyScore: number;

  @Column('text', { nullable: true })
  polylineCoordinates: string; // JSON array of route points

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.activityLogs, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column('uuid')
  userId: string;
}
