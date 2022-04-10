import devicesReducer from './devices/devicesSlice';
import notificationReducer from './notification/notificationSlice';

export const rootReducer = {
  devices: devicesReducer,
  notification: notificationReducer,
};
