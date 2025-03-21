export {
  getAllPathsThunk,
  createPathThunk,
  deletePathThunk,
  updatePathThunk,
  getPathByRoadIdThunk,
} from './api';

export type { IRawPathData, IPath, ArrayPathsType } from "./model";
export { pathReducer } from './slice';
export { useCreateNewPath } from './lib';


