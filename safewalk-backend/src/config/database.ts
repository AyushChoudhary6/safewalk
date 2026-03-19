import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { ActivityLog } from '../entities/ActivityLog';
import { EmergencyContact } from '../entities/EmergencyContact';
import { EscortRequest } from '../entities/EscortRequest';
import { Incident } from '../entities/Incident';
import { Route } from '../entities/Route';
import { SOSAlert } from '../entities/SOSAlert';
import { User } from '../entities/User';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'safewalk_db.sqlite',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, EmergencyContact, Incident, Route, EscortRequest, SOSAlert, ActivityLog],
  // migrations: [],
  dropSchema: false,
});
