import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getReactNativePersistence,
    initializeAuth,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5M2vFkPgIEepaCxFQtidK-NEH0lWVjuA",
  authDomain: "safewalk-8a200.firebaseapp.com",
  projectId: "safewalk-8a200",
  storageBucket: "safewalk-8a200.firebasestorage.app",
  messagingSenderId: "716111048136",
  appId: "1:716111048136:android:cdd7e0221b090b2b5564fd"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export interface UserData {
  id: string;
  email: string;
  name: string;
  verified: boolean;
}

export interface IncidentData {
  id: string;
  type: string;
  location: { latitude: number; longitude: number };
  description: string;
  timestamp: string;
  userId: string;
}

class FirebaseService {
  static async initialize(): Promise<void> {
    console.log("Firebase initialized");
  }

  static async login(email: string, password: string): Promise<UserData> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      id: user.uid,
      email: user.email || "",
      name: user.displayName || user.email?.split("@")[0] || "User",
      verified: user.emailVerified,
    };
  }

  static async register(email: string, password: string): Promise<UserData> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      id: user.uid,
      email: user.email || "",
      name: user.displayName || user.email?.split("@")[0] || "User",
      verified: user.emailVerified,
    };
  }

  static async getCurrentUser(): Promise<UserData | null> {
    const user = auth.currentUser;
    if (user) {
      return {
        id: user.uid,
        email: user.email || "",
        name: user.displayName || user.email?.split("@")[0] || "User",
        verified: user.emailVerified,
      };
    }
    return null;
  }

  static async logout(): Promise<void> {
    await signOut(auth);
    console.log("User logged out");
  }

  static async submitIncident(incident: Omit<IncidentData, "id" | "timestamp">): Promise<IncidentData> {
    return {
      ...incident,
      id: `incident_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }

  static async getIncidentsNearLocation(latitude: number, longitude: number, radiusKm: number = 1): Promise<IncidentData[]> {
    return [];
  }

  static async updateUserProfile(userId: string, data: any): Promise<void> {
    console.log("User profile updated", data);
  }

  static async sendNotification(userId: string, title: string, body: string): Promise<void> {
    console.log(`Notification to ${userId}: ${title} - ${body}`);
  }

  static async submitEmergencyAlert(userId: string, location: any): Promise<void> {
    console.log("Emergency alert submitted", location);
  }
}

export default FirebaseService;
