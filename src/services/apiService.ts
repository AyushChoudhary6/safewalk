/**
 * API Service
 * Central service for all backend API calls
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

// Determine API base URL based on platform
const getApiBaseUrl = () => {
  // Try to use environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // To avoid localhost networking issues across emulators and devices,
  // we're going to use your machine's actual IP address.
  // When running on device/emulator, 'localhost' often refers to the device itself.
  return 'http://192.168.10.3:5050/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle responses
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error('API Error:', {
          message: error.message,
          code: error.code,
          config: error.config ? {
            baseURL: error.config.baseURL,
            url: error.config.url,
            method: error.config.method,
          } : null,
          response: error.response ? {
            status: error.response.status,
            data: error.response.data,
          } : null,
        });
        
        if (error.response?.status === 401) {
          // Token expired, clear it
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('userInfo');
        }
        return Promise.reject(error);
      }
    );
  }

  // AUTH ENDPOINTS
  async register(name: string, email: string, password: string, phoneNumber?: string) {
    const response = await this.api.post('/auth/register', {
      name,
      email,
      password,
      phoneNumber,
    });
    if (response.data.data?.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.data.user));
      this.token = response.data.data.token;
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    if (response.data.data?.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.data.user));
      this.token = response.data.data.token;
    }
    return response.data;
  }

  async logout() {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userInfo');
    this.token = null;
    return { success: true };
  }

  // INCIDENT ENDPOINTS
  async reportIncident(
    type: string,
    latitude: number,
    longitude: number,
    severity?: number,
    description?: string,
    isAnonymous?: boolean
  ) {
    const payload = {
      type: type.toUpperCase(),
      latitude,
      longitude,
      severity: severity || 3,
      description,
      isAnonymous: isAnonymous ?? true,
    };
    
    console.log('📤 Sending incident report:', {
      url: `${this.api.defaults.baseURL}/incidents`,
      payload,
    });
    
    const response = await this.api.post('/incidents', payload);
    console.log('✅ Incident response:', response.data);
    return response.data;
  }

  async getNearbyIncidents(latitude: number, longitude: number, radius: number = 500) {
    const response = await this.api.get('/incidents/nearby', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  }

  async getRecentIncidents(limit: number = 50) {
    const response = await this.api.get('/incidents/recent', {
      params: { limit },
    });
    return response.data;
  }

  async getIncidentById(id: string) {
    const response = await this.api.get(`/incidents/${id}`);
    return response.data;
  }

  async verifyIncident(id: string) {
    const response = await this.api.put(`/incidents/${id}/verify`);
    return response.data;
  }

  // ROUTE ENDPOINTS
  async calculateRouteSafety(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
    routePoints?: Array<{ latitude: number; longitude: number }>
  ) {
    const response = await this.api.post('/routes/calculate-safety', {
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      routePoints,
    });
    return response.data;
  }

  async saveRoute(
    name: string,
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
    polylineCoordinates: Array<{ latitude: number; longitude: number }>,
    distanceMeters: number,
    estimatedMinutes: number
  ) {
    const response = await this.api.post('/routes', {
      name,
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      polylineCoordinates,
      distanceMeters,
      estimatedMinutes,
    });
    return response.data;
  }

  // ESCORT ENDPOINTS
  async requestEscort(
    pickupLatitude: number,
    pickupLongitude: number,
    dropoffLatitude: number,
    dropoffLongitude: number,
    notes?: string
  ) {
    const response = await this.api.post('/escorts/request', {
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude,
      notes,
    });
    return response.data;
  }

  async getEscortRequests(userId: string, asRequester: boolean = true) {
    const response = await this.api.get(`/escorts/requests/${userId}`, {
      params: { asRequester },
    });
    return response.data;
  }

  async respondToEscort(requestId: string, accept: boolean) {
    const response = await this.api.put(`/escorts/requests/${requestId}/respond`, {
      accept,
    });
    return response.data;
  }

  // EMERGENCY ENDPOINTS
  async createSOS(latitude: number, longitude: number, description?: string) {
    const response = await this.api.post('/emergency/sos', {
      latitude,
      longitude,
      description,
    });
    return response.data;
  }

  async getSOSAlerts(userId: string) {
    const response = await this.api.get(`/emergency/${userId}`);
    return response.data;
  }

  async resolveSOSAlert(alertId: string) {
    const response = await this.api.put(`/emergency/${alertId}/resolve`);
    return response.data;
  }

  // ACTIVITY ENDPOINTS
  async logWalkActivity(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
    distanceMeters: number,
    durationSeconds: number,
    incidentsEncountered?: number,
    averageSafetyScore?: number,
    notes?: string
  ) {
    const response = await this.api.post('/activity/walk', {
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      distanceMeters,
      durationSeconds,
      incidentsEncountered,
      averageSafetyScore,
      notes,
    });
    return response.data;
  }

  async getActivityHistory(userId: string, limit: number = 50) {
    const response = await this.api.get(`/activity/${userId}`, {
      params: { limit },
    });
    return response.data;
  }

  // USER ENDPOINTS
  async updateLocation(userId: string, latitude: number, longitude: number) {
    const response = await this.api.post(`/auth/users/${userId}/location`, {
      latitude,
      longitude,
    });
    return response.data;
  }

  async getUserProfile(userId: string) {
    const response = await this.api.get(`/auth/users/${userId}`);
    return response.data;
  }
}

export const apiService = new ApiService();
