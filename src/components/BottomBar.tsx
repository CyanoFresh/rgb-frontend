import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCurrentDevice, setMode } from '../features/devices/devicesSlice';
import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { modes } from '../utils/constants';

export function BottomBar() {
  const currentDevice = useAppSelector(selectCurrentDevice);
  const dispatch = useAppDispatch();

  const onModeChange = (event: React.SyntheticEvent, value: number) =>
    dispatch(setMode({ name: currentDevice.name, mode: value }));

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={4}>
      <BottomNavigation
        showLabels
        value={currentDevice.mode}
        onChange={onModeChange}
        sx={{
          height: 'unset',
        }}
      >
        {modes.map((mode) => (
          <BottomNavigationAction
            key={mode.value}
            label={mode.name}
            value={mode.value}
            icon={<mode.icon />}
            sx={{
              '& .MuiBottomNavigationAction-label': {
                fontWeight: 'bold',
                mb: 1.5,
                textTransform: 'uppercase',
                fontSize: '0.7rem',
              },
              '& .MuiBottomNavigationAction-label.Mui-selected': {
                fontSize: '0.7rem',
              },
              '& .MuiSvgIcon-root': {
                mt: 1.5,
                mb: 0.75,
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
