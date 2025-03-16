export interface ITransportInfo {
  departureTime?: string; // для транспорта (самолет, поезд)
  arrivalTime?: string; // для транспорта (самолет, поезд)
  flightNumber?: string; // для рейсов
  carNumber?: string; // для машин
}

export interface IRoadRowData {
  country: string;
  city: string;
  transport: 'поезд' | 'самолет' | 'машина';
  transportInfo?: ITransportInfo | null;
  routeInfo?: string;
  visibility: 'private' | 'friends' | 'public';
  tripStartDate: string;
  tripEndDate: string;
  accommodation?: string;
  checkInDate?: string;
  checkOutDate?: string;
  visitDates?: string;
}

export interface IRoad extends IRoadRowData {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  author: {
    id: number;
    username: string;
    email: string;
  };

  companions: Array<{
    id: number;
    username: string;
    email: string;
  }>;
}

export type RouteArrayType = IRoad[];
