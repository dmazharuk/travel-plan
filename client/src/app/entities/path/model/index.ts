import { IRoad } from '@/app/entities/road';

export interface IRawPathData {
    pathName?: string;
    roadId?: number;
}

export interface IPath extends IRawPathData {
  id: number ;
  roadId: number;
  createdAt: Date;
  updatedAt: Date;
  road: IRoad;
}

export type ArrayPathsType = Array<IPath>;