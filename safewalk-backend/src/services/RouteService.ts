import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Route } from '../entities/Route';
import { IncidentService } from './IncidentService';
import {
  calculateDistance,
  calculateSafetyScore,
  getSafetyRating,
} from '../utils/geospatial';
import { AppError } from '../utils/response';

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export class RouteService {
  private routeRepository: Repository<Route>;
  private incidentService: IncidentService;

  constructor() {
    this.routeRepository = AppDataSource.getRepository(Route);
    this.incidentService = new IncidentService();
  }

  async calculateRouteSafety(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    routePoints?: RoutePoint[]
  ): Promise<{
    safetyScore: number;
    safetyRating: 'green' | 'yellow' | 'red';
    incidentCount: number;
    nearbyIncidents: any[];
  }> {
    // Get incidents near start, end and midpoint
    const startIncidents = await this.incidentService.getNearbyIncidents(
      startLat,
      startLng,
      500
    );
    const endIncidents = await this.incidentService.getNearbyIncidents(
      endLat,
      endLng,
      500
    );

    // Get midpoint incidents if route points provided
    let midpointIncidents: any[] = [];
    if (routePoints && routePoints.length > 0) {
      const midIndex = Math.floor(routePoints.length / 2);
      const midpoint = routePoints[midIndex];
      midpointIncidents = await this.incidentService.getNearbyIncidents(
        midpoint.latitude,
        midpoint.longitude,
        500
      );
    }

    // Combine and deduplicate incidents
    const allIncidents = [
      ...startIncidents,
      ...endIncidents,
      ...midpointIncidents,
    ];
    const uniqueIncidents = Array.from(
      new Map(allIncidents.map((item) => [item.id, item])).values()
    );

    const safetyScore = calculateSafetyScore(uniqueIncidents);
    const safetyRating = getSafetyRating(safetyScore);

    return {
      safetyScore,
      safetyRating,
      incidentCount: uniqueIncidents.length,
      nearbyIncidents: uniqueIncidents,
    };
  }

  async saveRoute(
    name: string,
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    polylineCoordinates: RoutePoint[],
    distanceMeters: number,
    estimatedMinutes: number
  ): Promise<Route> {
    const { safetyScore, safetyRating, incidentCount } =
      await this.calculateRouteSafety(
        startLat,
        startLng,
        endLat,
        endLng,
        polylineCoordinates
      );

    const route = this.routeRepository.create({
      name,
      startLatitude: startLat,
      startLongitude: startLng,
      endLatitude: endLat,
      endLongitude: endLng,
      polylineCoordinates: JSON.stringify(polylineCoordinates),
      distanceMeters,
      estimatedMinutes,
      safetyScore,
      safetyRating,
      incidentCount,
    });

    return this.routeRepository.save(route);
  }

  async getRouteById(routeId: string): Promise<Route> {
    const route = await this.routeRepository.findOne({
      where: { id: routeId },
    });

    if (!route) {
      throw new AppError('Route not found', 404, 'ROUTE_NOT_FOUND');
    }

    return route;
  }
}
