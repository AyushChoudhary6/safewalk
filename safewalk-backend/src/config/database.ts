import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'safewalk_db.sqlite',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/entities/**/*.ts'],
  // migrations: ['src/migrations/**/*.ts'],
  dropSchema: false,
});
