export interface IRoadRowData {
 
  country: string;
  city: string;
  transport: string;
  transportInfo: string;
  routeInfo: string;
  visibility: string;
 
}

export interface IRoad extends IRoadRowData {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  author:{
    id: number;
    username: string;
    email: string;
  }
}

export type RouteArrayType = IRoad[]





