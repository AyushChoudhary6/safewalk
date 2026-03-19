import { AppDataSource } from '../config/database';
import {
  User,
  Incident,
  IncidentType,
  EmergencyContact,
  Route,
  ActivityLog,
} from '../entities';
import { hashPassword } from '../utils/password';

async function seed() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    const incidentRepository = AppDataSource.getRepository(Incident);
    const contactRepository = AppDataSource.getRepository(EmergencyContact);
    const routeRepository = AppDataSource.getRepository(Route);
    const activityRepository = AppDataSource.getRepository(ActivityLog);

    console.log('Creating seed users...');

    // Create test users
    const hashedPassword = await hashPassword('password123');

    const user1 = userRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: hashedPassword,
      phoneNumber: '+1 234-567-8900',
      role: 'user',
      isPremium: false,
      lastLatitude: 28.6139,
      lastLongitude: 77.209,
    });

    const user2 = userRepository.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash: hashedPassword,
      phoneNumber: '+1 234-567-8901',
      role: 'user',
      isPremium: true,
      premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lastLatitude: 28.6245,
      lastLongitude: 77.1993,
    });

    const user3 = userRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      phoneNumber: '+1 234-567-8902',
      role: 'admin',
      lastLatitude: 28.6129,
      lastLongitude: 77.2295,
    });

    await userRepository.save([user1, user2, user3]);
    console.log('✓ Created 3 test users');

    // Create emergency contacts
    const contact1 = contactRepository.create({
      user: user1,
      contactName: 'Sarah Doe',
      phoneNumber: '+1 234-567-8910',
      relationship: 'Sister',
    });

    const contact2 = contactRepository.create({
      user: user1,
      contactName: 'Emergency Services',
      phoneNumber: '911',
      relationship: 'Police',
    });

    await contactRepository.save([contact1, contact2]);
    console.log('✓ Created emergency contacts');

    // Create test incidents
    const incidents = [
      {
        type: IncidentType.THEFT,
        latitude: 28.614018,
        longitude: 77.079051,
        severity: 4,
        description: 'Phone snatching reported near market',
        reporter: user2,
      },
      {
        type: IncidentType.POOR_LIGHTING,
        latitude: 28.618128,
        longitude: 77.089151,
        severity: 2,
        description: 'Street lights broken on this road',
        reporter: user1,
      },
      {
        type: IncidentType.SUSPICIOUS_ACTIVITY,
        latitude: 28.623428,
        longitude: 77.101251,
        severity: 3,
        description: 'Group of suspicious individuals',
        reporter: null,
        isAnonymous: true,
      },
      {
        type: IncidentType.HARASSMENT,
        latitude: 28.625858,
        longitude: 77.122552,
        severity: 4,
        description: 'Verbal harassment reported',
        reporter: user2,
      },
      {
        type: IncidentType.ASSAULT,
        latitude: 28.60934,
        longitude: 77.100419,
        severity: 5,
        description: 'Physical altercation reported late night',
        reporter: null,
        isAnonymous: true,
      },
    ];

    for (const incidentData of incidents) {
      const incident = incidentRepository.create({
        type: incidentData.type,
        latitude: incidentData.latitude,
        longitude: incidentData.longitude,
        severity: incidentData.severity,
        description: incidentData.description,
        reporter: incidentData.reporter,
        isAnonymous: incidentData.isAnonymous || false,
        verificationCount: Math.floor(Math.random() * 3) + 1,
      });
      await incidentRepository.save(incident);
    }
    console.log('✓ Created 5 test incidents');

    // Create test routes
    const route1 = routeRepository.create({
      name: 'Safe Route to Park',
      startLatitude: 28.6139,
      startLongitude: 77.209,
      endLatitude: 28.6245,
      endLongitude: 77.1993,
      polylineCoordinates: JSON.stringify([
        [28.6139, 77.209],
        [28.6180, 77.205],
        [28.6245, 77.1993],
      ]),
      distanceMeters: 2000,
      estimatedMinutes: 25,
      safetyScore: 8.5,
      safetyRating: 'green',
      incidentCount: 0,
    });

    const route2 = routeRepository.create({
      name: 'Route via Market',
      startLatitude: 28.6139,
      startLongitude: 77.209,
      endLatitude: 28.6300,
      endLongitude: 77.2100,
      polylineCoordinates: JSON.stringify([
        [28.6139, 77.209],
        [28.6200, 77.210],
        [28.6300, 77.2100],
      ]),
      distanceMeters: 2500,
      estimatedMinutes: 30,
      safetyScore: 4,
      safetyRating: 'yellow',
      incidentCount: 3,
    });

    await routeRepository.save([route1, route2]);
    console.log('✓ Created test routes');

    // Create activity logs
    const activity1 = activityRepository.create({
      user: user1,
      activityType: 'WALK',
      startLatitude: 28.6139,
      startLongitude: 77.209,
      endLatitude: 28.6245,
      endLongitude: 77.1993,
      distanceMeters: 1200,
      durationSeconds: 1200,
      incidentsEncountered: 0,
      averageSafetyScore: 8.5,
      notes: 'Morning walk to coffee shop',
    });

    const activity2 = activityRepository.create({
      user: user2,
      activityType: 'WALK',
      startLatitude: 28.6245,
      startLongitude: 77.1993,
      endLatitude: 28.6350,
      endLongitude: 77.2050,
      distanceMeters: 1550,
      durationSeconds: 1560,
      incidentsEncountered: 1,
      averageSafetyScore: 6.5,
      notes: 'Evening walk, encountered suspicious individuals',
    });

    await activityRepository.save([activity1, activity2]);
    console.log('✓ Created activity logs');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Users:');
    console.log('- Email: john@example.com, Password: password123');
    console.log('- Email: jane@example.com, Password: password123');
    console.log('- Email: admin@example.com, Password: password123');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
