import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../features';

export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
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
