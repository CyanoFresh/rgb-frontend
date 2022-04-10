import { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureAppStore } from './configureAppStore';

export const store = configureAppStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
