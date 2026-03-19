import { Between, Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Incident, IncidentType } from '../entities/Incident';
import { calculateDistance } from '../utils/geospatial';
import { AppError } from '../utils/response';

export class IncidentService {
  private incidentRepository: Repository<Incident>;

  constructor() {
    this.incidentRepository = AppDataSource.getRepository(Incident);
  }

  async reportIncident(
    type: IncidentType,
    latitude: number,
    longitude: number,
    severity: number,
    description: string,
    reporterId?: string,
    isAnonymous: boolean = false
  ): Promise<Incident> {
    console.log('📍 Reporting incident:', { type, latitude, longitude, severity, description, isAnonymous });
    
    const incident = this.incidentRepository.create({
      type,
      latitude,
      longitude,
      severity: Math.min(Math.max(severity, 1), 5),
      description,
      reporterId: !isAnonymous ? reporterId : null,
      isAnonymous,
      location: `POINT(${longitude} ${latitude})`,
    });

    const savedIncident = await this.incidentRepository.save(incident);
    console.log('✅ Incident saved:', savedIncident.id);
    return savedIncident;
  }

  async getNearbyIncidents(
    latitude: number,
    longitude: number,
    radiusMeters: number = 500
  ): Promise<Incident[]> {
    // Using approximate bounding box since PostGIS may not be fully setup
    const degreesPerMeter = 1 / 111320;
    const latDelta = (radiusMeters * degreesPerMeter) * 1.5;
    const lngDelta = (radiusMeters * degreesPerMeter) * 1.5;

    const incidents = await this.incidentRepository.find({
      where: {
        latitude: Between(latitude - latDelta, latitude + latDelta),
        longitude: Between(longitude - lngDelta, longitude + lngDelta),
        isActive: true,
      },
      order: { createdAt: 'DESC' },
    });

    // Filter by actual distance
    return incidents.filter((incident) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        Number(incident.latitude),
        Number(incident.longitude)
      );
      return distance <= radiusMeters;
    });
  }

  async getIncidentById(incidentId: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({
      where: { id: incidentId },
    });

    if (!incident) {
      throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
    }

    return incident;
  }

  async verifyIncident(incidentId: string): Promise<Incident> {
    const incident = await this.getIncidentById(incidentId);
    incident.verificationCount += 1;
    return this.incidentRepository.save(incident);
  }

  async disputeIncident(incidentId: string): Promise<Incident> {
    const incident = await this.getIncidentById(incidentId);
    incident.disputeCount += 1;

    // Deactivate if too many disputes
    if (incident.disputeCount > incident.verificationCount) {
      incident.isActive = false;
    }

    return this.incidentRepository.save(incident);
  }

  async getRecentIncidents(limit: number = 50): Promise<Incident[]> {
    return this.incidentRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
