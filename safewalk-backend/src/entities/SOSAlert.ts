import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity('sos_alerts')
export class SOSAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column('varchar', { length: 500, nullable: true })
  description: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column('datetime', { nullable: true })
  resolvedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.sosAlerts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column('uuid')
  userId: string;
}
