import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { EscortRequest, EscortRequestStatus } from '../entities/EscortRequest';
import { AppError } from '../utils/response';

export class EscortService {
  private escortRepository: Repository<EscortRequest>;

  constructor() {
    this.escortRepository = AppDataSource.getRepository(EscortRequest);
  }

  async requestEscort(
    requesterId: string,
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
    notes?: string
  ): Promise<EscortRequest> {
    const escortRequest = this.escortRepository.create({
      requesterId,
      pickupLatitude: pickupLat,
      pickupLongitude: pickupLng,
      dropoffLatitude: dropoffLat,
      dropoffLongitude: dropoffLng,
      additionalNotes: notes,
      status: EscortRequestStatus.PENDING,
    });

    return this.escortRepository.save(escortRequest);
  }

  async getRequestsByUserId(
    userId: string,
    asRequester: boolean = true
  ): Promise<EscortRequest[]> {
    const whereClause = asRequester
      ? { requesterId: userId }
      : { escortId: userId };

    return this.escortRepository.find({
      where: whereClause,
      relations: asRequester ? ['escort'] : ['requester'],
      order: { updatedAt: 'DESC' },
    });
  }

  async respondToRequest(
    requestId: string,
    escortId: string,
    accept: boolean
  ): Promise<EscortRequest> {
    const request = await this.escortRepository.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new AppError(
        'Escort request not found',
        404,
        'REQUEST_NOT_FOUND'
      );
    }

    if (accept) {
      request.status = EscortRequestStatus.ACCEPTED;
      request.escort = { id: escortId } as any;
      request.acceptedAt = new Date();
    } else {
      request.status = EscortRequestStatus.CANCELLED;
    }

    return this.escortRepository.save(request);
  }

  async markEscortInProgress(requestId: string): Promise<EscortRequest> {
    const request = await this.escortRepository.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new AppError(
        'Escort request not found',
        404,
        'REQUEST_NOT_FOUND'
      );
    }

    request.status = EscortRequestStatus.IN_PROGRESS;
    return this.escortRepository.save(request);
  }

  async completeEscort(requestId: string): Promise<EscortRequest> {
    const request = await this.escortRepository.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new AppError(
        'Escort request not found',
        404,
        'REQUEST_NOT_FOUND'
      );
    }

    request.status = EscortRequestStatus.COMPLETED;
    request.completedAt = new Date();
    return this.escortRepository.save(request);
  }
}
