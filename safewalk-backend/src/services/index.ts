import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { ActivityLog } from '../entities/ActivityLog';
import { AppError } from '../utils/response';

export class ActivityService {
  private activityRepository: Repository<ActivityLog>;

  constructor() {
    this.activityRepository = AppDataSource.getRepository(ActivityLog);
  }

  async logWalkActivity(
    userId: string,
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    distanceMeters: number,
    durationSeconds: number,
    incidentsEncountered: number = 0,
    averageSafetyScore?: number,
    polylineCoordinates?: string,
    notes?: string
  ): Promise<ActivityLog> {
    const activity = this.activityRepository.create({
      userId,
      activityType: 'WALK',
      startLatitude: startLat,
      startLongitude: startLng,
      endLatitude: endLat,
      endLongitude: endLng,
      distanceMeters,
      durationSeconds,
      incidentsEncountered,
      averageSafetyScore,
      polylineCoordinates,
      notes,
    });

    return this.activityRepository.save(activity);
  }

  async logActivity(
    userId: string,
    activityType: string,
    startLat: number,
    startLng: number,
    data?: {
      endLat?: number;
      endLng?: number;
      distanceMeters?: number;
      durationSeconds?: number;
      incidentsEncountered?: number;
      averageSafetyScore?: number;
      polylineCoordinates?: string;
      notes?: string;
    }
  ): Promise<ActivityLog> {
    const activity = this.activityRepository.create({
      userId,
      activityType,
      startLatitude: startLat,
      startLongitude: startLng,
      endLatitude: data?.endLat,
      endLongitude: data?.endLng,
      distanceMeters: data?.distanceMeters || 0,
      durationSeconds: data?.durationSeconds || 0,
      incidentsEncountered: data?.incidentsEncountered || 0,
      averageSafetyScore: data?.averageSafetyScore,
      polylineCoordinates: data?.polylineCoordinates,
      notes: data?.notes,
    });

    return this.activityRepository.save(activity);
  }

  async getUserActivityHistory(userId: string, limit: number = 50): Promise<ActivityLog[]> {
    return this.activityRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getActivityById(activityId: string): Promise<ActivityLog> {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
    });

    if (!activity) {
      throw new AppError('Activity not found', 404, 'ACTIVITY_NOT_FOUND');
    }

    return activity;
  }
}
