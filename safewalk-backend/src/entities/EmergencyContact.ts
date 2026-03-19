import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity('emergency_contacts')
export class EmergencyContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  contactName: string;

  @Column('varchar', { length: 20 })
  phoneNumber: string;

  @Column('varchar', { length: 100, nullable: true })
  relationship: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.emergencyContacts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column('uuid')
  userId: string;
}
