import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1699564800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "passwordHash" varchar(255) NOT NULL,
        "phoneNumber" varchar(20),
        "profilePhoto" text,
        "role" varchar(50) DEFAULT 'user',
        "isPremium" boolean DEFAULT false,
        "premiumExpiresAt" timestamp,
        "lastLatitude" numeric(10, 8),
        "lastLongitude" numeric(11, 8),
        "lastLocationUpdate" timestamp,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create emergency_contacts table
    await queryRunner.query(`
      CREATE TABLE "emergency_contacts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "contactName" varchar(100) NOT NULL,
        "phoneNumber" varchar(20) NOT NULL,
        "relationship" varchar(100),
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create incidents table
    await queryRunner.query(`
      CREATE TABLE "incidents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "type" varchar(50) NOT NULL,
        "description" varchar(500),
        "latitude" numeric(10, 8) NOT NULL,
        "longitude" numeric(11, 8) NOT NULL,
        "severity" int DEFAULT 3,
        "isAnonymous" boolean DEFAULT false,
        "reporterId" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "verificationCount" int DEFAULT 1,
        "disputeCount" int DEFAULT 0,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create routes table
    await queryRunner.query(`
      CREATE TABLE "routes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "startLatitude" numeric(10, 8) NOT NULL,
        "startLongitude" numeric(11, 8) NOT NULL,
        "endLatitude" numeric(10, 8) NOT NULL,
        "endLongitude" numeric(11, 8) NOT NULL,
        "polylineCoordinates" text NOT NULL,
        "distanceMeters" numeric(10, 2) NOT NULL,
        "estimatedMinutes" int NOT NULL,
        "safetyScore" numeric(5, 2) DEFAULT 5,
        "safetyRating" varchar(10) DEFAULT 'green',
        "incidentCount" int DEFAULT 0,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create escort_requests table
    await queryRunner.query(`
      CREATE TABLE "escort_requests" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "requesterId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "escortId" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "pickupLatitude" numeric(10, 8) NOT NULL,
        "pickupLongitude" numeric(11, 8) NOT NULL,
        "dropoffLatitude" numeric(10, 8) NOT NULL,
        "dropoffLongitude" numeric(11, 8) NOT NULL,
        "additionalNotes" text,
        "status" varchar(50) DEFAULT 'PENDING',
        "acceptedAt" timestamp,
        "completedAt" timestamp,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sos_alerts table
    await queryRunner.query(`
      CREATE TABLE "sos_alerts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "latitude" numeric(10, 8) NOT NULL,
        "longitude" numeric(11, 8) NOT NULL,
        "description" varchar(500),
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
        "resolvedAt" timestamp
      )
    `);

    // Create activity_logs table
    await queryRunner.query(`
      CREATE TABLE "activity_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "activityType" varchar(100) NOT NULL,
        "startLatitude" numeric(10, 8) NOT NULL,
        "startLongitude" numeric(11, 8) NOT NULL,
        "endLatitude" numeric(10, 8),
        "endLongitude" numeric(11, 8),
        "distanceMeters" numeric(10, 2) DEFAULT 0,
        "durationSeconds" int DEFAULT 0,
        "incidentsEncountered" int DEFAULT 0,
        "averageSafetyScore" numeric(5, 2),
        "polylineCoordinates" text,
        "notes" text,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX idx_incident_location ON "incidents"(latitude, longitude)`);
    await queryRunner.query(`CREATE INDEX idx_incident_type ON "incidents"(type)`);
    await queryRunner.query(`CREATE INDEX idx_incident_date ON "incidents"("createdAt")`);
    await queryRunner.query(`CREATE INDEX idx_user_email ON "users"(email)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "activity_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sos_alerts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "escort_requests"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "routes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "incidents"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "emergency_contacts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
