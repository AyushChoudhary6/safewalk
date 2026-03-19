import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { IncidentService } from '../services/IncidentService';
import { IncidentType } from '../entities/Incident';
import { AppError } from '../utils/response';

const incidentService = new IncidentService();

export const reportIncidentController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { type, latitude, longitude, severity, description, isAnonymous } =
      req.body;

    if (!type || !latitude || !longitude) {
      throw new AppError('Missing required fields', 400, 'INVALID_INPUT');
    }

    if (!Object.values(IncidentType).includes(type)) {
      throw new AppError('Invalid incident type', 400, 'INVALID_TYPE');
    }

    const incident = await incidentService.reportIncident(
      type,
      latitude,
      longitude,
      severity || 3,
      description,
      req.user?.userId,
      isAnonymous || false
    );

    res.status(201).json({
      success: true,
      data: incident,
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'REPORT_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const getNearbyIncidentsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      throw new AppError(
        'Missing latitude or longitude',
        400,
        'INVALID_INPUT'
      );
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const radiusMeters = parseInt((radius as string) || '500');

    const incidents = await incidentService.getNearbyIncidents(
      lat,
      lng,
      radiusMeters
    );

    res.json({
      success: true,
      data: incidents,
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

export const getIncidentController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const incident = await incidentService.getIncidentById(id);

    res.json({
      success: true,
      data: incident,
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

export const verifyIncidentController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const incident = await incidentService.verifyIncident(id);

    res.json({
      success: true,
      data: incident,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'VERIFY_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const disputeIncidentController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const incident = await incidentService.disputeIncident(id);

    res.json({
      success: true,
      data: incident,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'DISPUTE_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const getRecentIncidentsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { limit } = req.query;
    const incidentLimit = limit ? parseInt(limit as string) : 50;

    const incidents = await incidentService.getRecentIncidents(incidentLimit);

    res.json({
      success: true,
      data: incidents,
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
