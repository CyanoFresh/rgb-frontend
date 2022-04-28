import { useAppSelector } from '../app/hooks';
import { selectCurrentDevice } from '../features/devices/devicesSlice';
import React from 'react';
import { ColorPicker } from './ColorPicker';
import { Container } from '@mui/material';

export function Device() {
  const device = useAppSelector(selectCurrentDevice);

  return (
    <>
      {device.mode === 0 && (
        <Container
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <ColorPicker color={device.color1} />
        </Container>
      )}
    </>
  );
}
