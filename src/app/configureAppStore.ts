import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../features';

export function configureAppStore() {
  const store = configureStore({
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
  });

  // hmr for redux toolkit
  // if (process.env.NODE_ENV === 'development' && module.hot) {
  //   module.hot.accept('../features', () => {
  //     console.log('callback');
  //     const newRootReducer = require('../features').rootReducer;
  //     console.log(rootReducer);
  //     store.replaceReducer(newRootReducer);
  //   });
  // }
  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('../features', () => {
  //     console.log('callback');
  //     // @ts-ignore
  //     store.replaceReducer(rootReducer);
  //   });
  // }

  return store;
}
