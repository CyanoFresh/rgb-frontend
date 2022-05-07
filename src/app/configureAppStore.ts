import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../features';
// import logger from 'redux-logger';

export function configureAppStore() {
  let middlewareConfig = {};

  if (process.env.NODE_ENV === 'development') {
    middlewareConfig = {
      // middleware: (getDefaultMiddleware: any) => getDefaultMiddleware().concat(logger),
    };
  }

  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      devices: {
        connecting: false,
        devices: [
          {
            name: 'Device 1',
            batteryLevel: 56,
            color1: [0, 255, 0],
            mode: 0,
          },
          {
            name: 'Device 2',
            batteryLevel: 77,
            color1: [255, 255, 0],
            mode: 0,
          },
        ],
        selectedDeviceIndex: 0,
      },
    },
    ...middlewareConfig,
  });
}
