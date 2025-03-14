import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../entities/user';
import { roadReducer } from '../entities/route';

const store = configureStore({
  reducer: {
    user:userReducer,
    road:roadReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
