import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { RouteService } from '../services/RouteService';
import { AppError } from '../utils/response';

const routeService = new RouteService();

export const calculateRouteSafetyController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { startLatitude, startLongitude, endLatitude, endLongitude, routePoints } =
      req.body;

    if (
      !startLatitude ||
      !startLongitude ||
      !endLatitude ||
      !endLongitude
    ) {
      throw new AppError('Missing required fields', 400, 'INVALID_INPUT');
    }

    const safetyData = await routeService.calculateRouteSafety(
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      routePoints
    );

    res.json({
      success: true,
      data: safetyData,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'CALCULATE_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const saveRouteController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      name,
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      polylineCoordinates,
      distanceMeters,
      estimatedMinutes,
    } = req.body;

    if (
      !name ||
      !startLatitude ||
      !startLongitude ||
      !endLatitude ||
      !endLongitude ||
      !polylineCoordinates
    ) {
      throw new AppError('Missing required fields', 400, 'INVALID_INPUT');
    }

    const route = await routeService.saveRoute(
      name,
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      polylineCoordinates,
      distanceMeters || 0,
      estimatedMinutes || 0
    );

    res.status(201).json({
      success: true,
      data: route,
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'SAVE_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const getRouteController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const route = await routeService.getRouteById(id);

    res.json({
      success: true,
      data: route,
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
