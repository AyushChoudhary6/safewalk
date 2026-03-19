import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { SOSAlert } from '../entities/SOSAlert';
import { AppError } from '../utils/response';

export class EmergencyService {
  private sosRepository: Repository<SOSAlert>;

  constructor() {
    this.sosRepository = AppDataSource.getRepository(SOSAlert);
  }

  async createSOSAlert(
    userId: string,
    latitude: number,
    longitude: number,
    description?: string
  ): Promise<SOSAlert> {
    const sosAlert = this.sosRepository.create({
      userId,
      latitude,
      longitude,
      description,
      isActive: true,
    });

    return this.sosRepository.save(sosAlert);
  }

  async getSOSAlertsByUser(userId: string): Promise<SOSAlert[]> {
    return this.sosRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async resolveSOSAlert(alertId: string): Promise<SOSAlert> {
    const alert = await this.sosRepository.findOne({
      where: { id: alertId },
    });

    if (!alert) {
      throw new AppError('SOS alert not found', 404, 'ALERT_NOT_FOUND');
    }

    alert.isActive = false;
    alert.resolvedAt = new Date();
    return this.sosRepository.save(alert);
  }

  async getActiveSOSAlerts(): Promise<SOSAlert[]> {
    return this.sosRepository.find({
      where: { isActive: true },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
