import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../entities/user';
import { roadReducer } from '../entities/road';
import { alertsReducer } from '@/features/alert';

const store = configureStore({
  reducer: {
    user: userReducer,
    road: roadReducer,
    alerts: alertsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
