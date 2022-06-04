import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { addDevice, selectCurrentDevice } from '../../features/devices/devicesSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AddIcon from '@mui/icons-material/Add';
import { BatteryIcon } from './BatteryIcon';
import { SelectDeviceMenu } from './SelectDeviceMenu';

export function TopBar() {
  const batteryLevel = useAppSelector((state) => selectCurrentDevice(state).batteryLevel);
  const connecting = useAppSelector((state) => state.devices.connecting);
  const isReconnecting = useAppSelector(
    (state) => selectCurrentDevice(state).isReconnecting,
  );
  const dispatch = useAppDispatch();

  const handleAddDeviceClick = () => dispatch(addDevice());

  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isReconnecting ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <BatteryIcon level={batteryLevel} />
              <Typography fontWeight="bold">{batteryLevel}%</Typography>
            </>
          )}
        </Box>

        <SelectDeviceMenu />

        {connecting ? (
          <Box sx={{ p: 1, display: 'flex', alignContent: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <IconButton color="inherit" onClick={handleAddDeviceClick}>
            <AddIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
