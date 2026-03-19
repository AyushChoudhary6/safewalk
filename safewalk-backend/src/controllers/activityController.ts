import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../utils/response';
import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/ActivityLog';
import { AppDataSource } from '../config/database';

const activityRepository = AppDataSource.getRepository(ActivityLog);

export const logWalkActivityController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      distanceMeters,
      durationSeconds,
      incidentsEncountered,
      averageSafetyScore,
      polylineCoordinates,
      notes,
    } = req.body;

    if (
      !startLatitude ||
      !startLongitude
    ) {
      throw new AppError('Missing required fields', 400, 'INVALID_INPUT');
    }

    const activity = activityRepository.create({
      userId: req.user!.userId,
      activityType: 'WALK',
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      distanceMeters,
      durationSeconds,
      incidentsEncountered,
      averageSafetyScore,
      polylineCoordinates,
      notes,
    });

    await activityRepository.save(activity);

    res.status(201).json({
      success: true,
      data: activity,
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'LOG_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const getActivityHistoryController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;

    if (
      req.user?.userId !== userId &&
      req.user?.role !== 'admin'
    ) {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    const activityLimit = limit ? parseInt(limit as string) : 50;

    const activities = await activityRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: activityLimit,
    });

    res.json({
      success: true,
      data: activities,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'FETCH_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const getActivityController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { activityId } = req.params;

    const activity = await activityRepository.findOne({
      where: { id: activityId },
    });

    if (!activity) {
      throw new AppError('Activity not found', 404, 'ACTIVITY_NOT_FOUND');
    }

    if (
      req.user?.userId !== activity.userId &&
      req.user?.role !== 'admin'
    ) {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    res.json({
      success: true,
      data: activity,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'FETCH_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};
