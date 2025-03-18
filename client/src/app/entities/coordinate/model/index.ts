import { IPath } from '@/app/entities/path';

export interface IRawCoordinateData {
    // coordinateName: string;

    latitude: number,
    longitude: number,
    coordinateTitle: string,
    coordinateBody: string,
    coordinateNumber: number,
    pathId?: number, 

}

export interface ICoordinate extends IRawCoordinateData {
  id: number;
  pathId: number;
  createdAt: Date;
  updatedAt: Date;
  path: IPath;
}

export type ArrayCoordinatesType = Array<ICoordinate>;