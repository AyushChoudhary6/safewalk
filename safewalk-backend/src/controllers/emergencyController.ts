import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { EmergencyService } from '../services/EmergencyService';
import { AppError } from '../utils/response';

const emergencyService = new EmergencyService();

export const createSOSAlertController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { latitude, longitude, description } = req.body;

    if (!latitude || !longitude) {
      throw new AppError(
        'Missing latitude or longitude',
        400,
        'INVALID_INPUT'
      );
    }

    const sosAlert = await emergencyService.createSOSAlert(
      req.user!.userId,
      latitude,
      longitude,
      description
    );

    res.status(201).json({
      success: true,
      data: sosAlert,
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'SOS_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const getSOSAlertsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;

    if (
      req.user?.userId !== userId &&
      req.user?.role !== 'admin'
    ) {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    const alerts = await emergencyService.getSOSAlertsByUser(userId);

    res.json({
      success: true,
      data: alerts,
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

export const resolveSOSAlertController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { alertId } = req.params;

    const alert = await emergencyService.resolveSOSAlert(alertId);

    res.json({
      success: true,
      data: alert,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'RESOLVE_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const getActiveSOSAlertsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Only admins and moderators should be able to fetch all active SOS alerts
    if (
      req.user?.role !== 'admin' &&
      req.user?.role !== 'moderator'
    ) {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    const alerts = await emergencyService.getActiveSOSAlerts();

    res.json({
      success: true,
      data: alerts,
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
