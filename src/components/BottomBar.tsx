import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCurrentDevice, setMode } from '../features/devices/devicesSlice';
import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { modes } from '../features/devices/constants';

export function BottomBar() {
  const currentDevice = useAppSelector(selectCurrentDevice);
  const dispatch = useAppDispatch();

  const onModeChange = (event: React.SyntheticEvent, value: number) =>
    dispatch(setMode({ name: currentDevice.name, mode: value }));

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={8}>
      <BottomNavigation showLabels value={currentDevice.mode} onChange={onModeChange}>
        {modes.map((mode) => (
          <BottomNavigationAction
            key={mode.value}
            label={mode.name}
            value={mode.value}
            icon={<mode.icon />}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
