import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../features';

// import logger from 'redux-logger';

export function configureAppStore() {
  let middlewareConfig = {};

  if (process.env.NODE_ENV === 'development') {
    middlewareConfig = {
      // middleware: (getDefaultMiddleware: any) => getDefaultMiddleware().concat(logger),
    };
  }

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      devices: {
        connecting: false,
        devices: [
          {
            name: 'Device 1',
            batteryLevel: 56,
            color1: [0, 100, 50],
            mode: 0,
          },
          {
            name: 'Device 2',
            batteryLevel: 77,
            color1: [135, 100, 50],
            mode: 0,
          },
        ],
        selectedDeviceIndex: 0,
      },
    },
    ...middlewareConfig,
  });

  // @ts-ignore
  if (process.env.NODE_ENV !== 'production' && import.meta.webpackHot) {
    // @ts-ignore
    import.meta.webpackHot.accept(
      '../features',
      () => {
        store.replaceReducer(combineReducers(rootReducer));
      },
      (...args: any) => {
        console.log('rejected', ...args);
      },
    );
  }

  return store;
}
