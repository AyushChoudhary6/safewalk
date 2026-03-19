import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('decimal', { precision: 10, scale: 8 })
  startLatitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  startLongitude: number;

  @Column('decimal', { precision: 10, scale: 8 })
  endLatitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  endLongitude: number;

  @Column('text')
  polylineCoordinates: string; // JSON array of [lat, lng] pairs

  @Column('decimal', { precision: 10, scale: 2 })
  distanceMeters: number;

  @Column('int')
  estimatedMinutes: number;

  @Column('decimal', { precision: 5, scale: 2, default: 5 })
  safetyScore: number; // 1-10 scale where 10 is safest

  @Column('varchar', { length: 10, default: 'green' })
  safetyRating: 'green' | 'yellow' | 'red'; // Based on incidents

  @Column('int', { default: 0 })
  incidentCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
