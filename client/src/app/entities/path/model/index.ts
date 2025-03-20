import { IRoad } from '@/app/entities/road';
import { IUser } from '../../user';

export interface IRawPathData {
    pathName?: string;
    roadId?: number;
}

export interface IPath extends IRawPathData {
  id: number ;
  userId: number;
  roadId: number;
  createdAt: Date;
  updatedAt: Date;
  road: IRoad;
  user?: IUser;
}

export type ArrayPathsType = Array<IPath>;