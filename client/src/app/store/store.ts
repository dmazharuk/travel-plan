import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../entities/user';
import { roadReducer } from '../entities/road';
import { alertsReducer } from '@/features/alert';
import { coordinateReducer } from '../entities/coordinate';
import { pathReducer } from '../entities/path';

const store = configureStore({
  reducer: {
    user: userReducer,
    road: roadReducer,
    alerts: alertsReducer,
    path: pathReducer,
    coordinate: coordinateReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
