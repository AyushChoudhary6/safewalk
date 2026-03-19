import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './User';

export enum IncidentType {
  THEFT = 'THEFT',
  HARASSMENT = 'HARASSMENT',
  POOR_LIGHTING = 'POOR_LIGHTING',
  ASSAULT = 'ASSAULT',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

@Entity('incidents')
@Index('idx_incident_location', ['latitude', 'longitude'])
@Index('idx_incident_type', ['type'])
@Index('idx_incident_date', ['createdAt'])
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50, default: IncidentType.SUSPICIOUS_ACTIVITY })
  type: IncidentType;

  @Column('varchar', { length: 500, nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column('text', {
    nullable: true,
  })
  location: string;

  @Column('int', { default: 3 })
  severity: number; // 1-5 scale

  @Column('boolean', { default: false })
  isAnonymous: boolean;

  @Column('int', { default: 1 })
  verificationCount: number; // Number of users who verified this incident

  @Column('int', { default: 0 })
  disputeCount: number; // Number of users who disputed this incident

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.incidentsReported, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  reporter: User;

  @Column('uuid', { nullable: true })
  reporterId: string;
}
