import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Box, Button, CircularProgress, Container } from '@mui/material';
import { addDevice } from '../features/devices/devicesSlice';
import React from 'react';
import { Device } from './Device';
import { Welcome } from './Welcome';

export function Content() {
  const dispatch = useAppDispatch();
  const devices = useAppSelector((state) => state.devices.devices);
  const connecting = useAppSelector((state) => state.devices.connecting);

  return (
    <Container fixed sx={{ textAlign: 'center' }}>
      {devices.length > 0 ? (
        <>
          {devices.map((device) => (
            <Device key={device.name} device={device} />
          ))}

          <Box sx={{ margin: '10px 0' }}>{connecting && <CircularProgress />}</Box>

          <Box sx={{ margin: '10px 0' }}>
            <Button onClick={() => dispatch(addDevice())} variant="contained">
              Connect
            </Button>
          </Box>
        </>
      ) : (
        <Welcome />
      )}
    </Container>
  );
}
