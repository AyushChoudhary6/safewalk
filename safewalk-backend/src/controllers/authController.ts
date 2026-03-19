import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuthService } from '../services/AuthService';
import { ApiResponse, AppError } from '../utils/response';

const authService = new AuthService();

export const registerController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { email, password, name, phoneNumber } = req.body;

    if (!email || !password || !name) {
      throw new AppError('Missing required fields', 400, 'INVALID_INPUT');
    }

    const { user, token } = await authService.register(
      email,
      password,
      name,
      phoneNumber
    );

    res.status(201).json({
      success: true,
      data: { user: { ...user, passwordHash: undefined }, token },
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'REGISTER_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const loginController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Missing required fields', 400, 'INVALID_INPUT');
    }

    const { user, token } = await authService.login(email, password);

    res.json({
      success: true,
      data: { user: { ...user, passwordHash: undefined }, token },
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'LOGIN_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const logoutController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Token is invalidated on client side
    res.json({
      success: true,
      message: 'Logged out successfully',
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      statusCode: 500,
    });
  }
};

export const getUserController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Allow users to fetch their own profile or admin to fetch any
    if (req.user?.userId !== id && req.user?.role !== 'admin') {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    const user = await authService.getUserById(id);

    res.json({
      success: true,
      data: { ...user, passwordHash: undefined },
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

export const updateUserController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Allow users to update their own profile or admin to update any
    if (req.user?.userId !== id && req.user?.role !== 'admin') {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    // Prevent privilege escalation
    if (updates.role && req.user?.role !== 'admin') {
      delete updates.role;
    }

    const user = await authService.updateUser(id, updates);

    res.json({
      success: true,
      data: { ...user, passwordHash: undefined },
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'UPDATE_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};

export const updateLocationController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      throw new AppError(
        'Missing latitude or longitude',
        400,
        'INVALID_INPUT'
      );
    }

    if (req.user?.userId !== id && req.user?.role !== 'admin') {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    await authService.updateLocation(id, latitude, longitude);

    res.json({
      success: true,
      message: 'Location updated',
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'UPDATE_ERROR',
      statusCode: error.statusCode || 500,
    });
  }
};
