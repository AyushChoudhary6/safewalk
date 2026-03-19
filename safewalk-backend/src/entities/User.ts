import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { EmergencyContact } from './EmergencyContact';
import { Incident } from './Incident';
import { EscortRequest } from './EscortRequest';
import { SOSAlert } from './SOSAlert';
import { ActivityLog } from './ActivityLog';

@Entity('users')
@Index('idx_user_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 255 })
  passwordHash: string;

  @Column('varchar', { length: 20, nullable: true })
  phoneNumber: string;

  @Column('text', { nullable: true })
  profilePhoto: string;

  @Column('varchar', { length: 50, default: 'user' })
  role: 'user' | 'moderator' | 'admin';

  @Column('boolean', { default: false })
  isPremium: boolean;

  @Column('datetime', { nullable: true })
  premiumExpiresAt: Date;

  @Column('text', {
    nullable: true,
  })
  lastLocation: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  lastLatitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  lastLongitude: number;

  @Column('datetime', { nullable: true })
  lastLocationUpdate: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => EmergencyContact, (contact) => contact.user, {
    cascade: true,
    eager: true,
  })
  emergencyContacts: EmergencyContact[];

  @OneToMany(() => Incident, (incident) => incident.reporter)
  incidentsReported: Incident[];

  @OneToMany(() => EscortRequest, (request) => request.requester)
  escortRequests: EscortRequest[];

  @OneToMany(() => EscortRequest, (request) => request.escort)
  escortMatches: EscortRequest[];

  @OneToMany(() => SOSAlert, (alert) => alert.user)
  sosAlerts: SOSAlert[];

  @OneToMany(() => ActivityLog, (log) => log.user)
  activityLogs: ActivityLog[];
}
