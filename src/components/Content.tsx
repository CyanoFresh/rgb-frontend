import { useAppDispatch, useAppSelector } from '../app/hooks';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Device } from './Device';
import { Welcome } from './Welcome';
import { Connecting } from './Connecting';
import React from 'react';
import { TopBar } from './TopBar';
import { setMode } from '../features/devices/devicesSlice';
import { modes } from '../features/devices/constants';

export function Content() {
  const dispatch = useAppDispatch();

  const devices = useAppSelector((state) => state.devices.devices);
  const connecting = useAppSelector((state) => state.devices.connecting);
  const selectedDeviceIndex = useAppSelector(
    (state) => state.devices.selectedDeviceIndex,
  );

  const onModeChange = (event: React.SyntheticEvent, value: number) =>
    dispatch(setMode({ name: devices[selectedDeviceIndex!].name, mode: value }));

  if (devices.length === 0) {
    if (connecting) {
      return <Connecting />;
    }

    return <Welcome />;
  }

  return (
    <>
      <TopBar />
      <Device device={devices[selectedDeviceIndex!]} />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={8}>
        <BottomNavigation
          showLabels
          value={parseInt('' + devices[selectedDeviceIndex!].mode) || 0}
          onChange={onModeChange}
        >
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
    </>
  );
}
