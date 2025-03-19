export type {
  IRawCoordinateData,
  ICoordinate,
  ArrayCoordinatesType,
} from "./model";

export {
  getAllCoordinatesThunk,
  createCoordinateThunk,
  deleteCoordinateThunk,
  updateCoordinateThunk,
} from './api';

export { coordinateReducer } from './slice';