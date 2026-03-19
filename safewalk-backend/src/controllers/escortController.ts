import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { EscortService } from '../services/EscortService';
import { AppError } from '../utils/response';

const escortService = new EscortService();

export const requestEscortController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude,
      notes,
    } = req.body;

    if (
      !pickupLatitude ||
      !pickupLongitude ||
      !dropoffLatitude ||
      !dropoffLongitude
    ) {
      throw new AppError('Missing required fields', 400, 'INVALID_INPUT');
    }

    const escortRequest = await escortService.requestEscort(
      req.user!.userId,
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude,
      notes
    );

    res.status(201).json({
      success: true,
      data: escortRequest,
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'REQUEST_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const getEscortRequestsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const { asRequester } = req.query;

    if (
      req.user?.userId !== userId &&
      req.user?.role !== 'admin'
    ) {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    const requests = await escortService.getRequestsByUserId(
      userId,
      asRequester !== 'false'
    );

    res.json({
      success: true,
      data: requests,
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

export const respondToEscortController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;

    const escortRequest = await escortService.respondToRequest(
      requestId,
      req.user!.userId,
      accept
    );

    res.json({
      success: true,
      data: escortRequest,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'RESPOND_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const startEscortController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { requestId } = req.params;

    const escortRequest = await escortService.markEscortInProgress(requestId);

    res.json({
      success: true,
      data: escortRequest,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'START_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const completeEscortController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { requestId } = req.params;

    const escortRequest = await escortService.completeEscort(requestId);

    res.json({
      success: true,
      data: escortRequest,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'COMPLETE_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};
