export type AppMode = 'etudiant' | 'navette' | 'conducteur';

export interface TransitNode {
  id: string;
  name: string;
  shortLabel: string;
  type: 'origin' | 'destination';
  x: number; // percentage in map coordinate system
  y: number;
  availableDrivers: number;
  averageEtaMinutes: number;
  distanceKm: number;
  description: string;
}

export interface DriverRide {
  id: string;
  driverName: string;
  driverRole: string; // e.g. "Stagiaire Digital CMC"
  avatar: string;
  carModel: string;
  carColor: string;
  rating: number;
  totalTrips: number;
  originId: string;
  originName: string;
  destinationName: string;
  departureTime: string;
  seatsTotal: number;
  seatsAvailable: number;
  priceMad: number;
  verifiedStudent: boolean;
}

export interface NavetteSeat {
  id: number;
  label: string;
  isDriver?: boolean;
  status: 'empty' | 'occupied' | 'selected';
  passengerName?: string;
}

export interface BoardingPassData {
  ticketId: string;
  passengerName: string;
  serviceType: 'Covoiturage Étudiant' | 'Smart Navette CMC';
  origin: string;
  destination: string;
  departureTime: string;
  seatInfo: string;
  driverOrVehicle: string;
  priceMad: number;
  qrMatrix: boolean[][]; // 2D QR representation
  timestamp: string;
}
