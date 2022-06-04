import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { addDevice, checkBluetooth } from '../features/devices/devicesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import React, { useEffect } from 'react';

export function Welcome() {
  const isConnecting = useAppSelector((state) => state.devices.connecting);
  const bluetoothEnabled = useAppSelector((state) => state.devices.bluetoothEnabled);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkBluetooth());
  }, [dispatch]);

  let content;

  if (isConnecting) {
    content = (
      <>
        <CircularProgress size="5rem" sx={{ mb: 5 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Connecting...
        </Typography>
        <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
          Turn on Bluetooth and select RGB controller device
        </Typography>
      </>
    );
  } else {
    content = (
      <>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Welcome
        </Typography>
        <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
          Turn on Bluetooth and connect first device
        </Typography>
      </>
    );
  }

  if (bluetoothEnabled == null) {
    content = <CircularProgress size="5rem" sx={{ mb: 5 }} />;
  } else if (bluetoothEnabled === false) {
    content = (
      <>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Bluetooth is disabled
        </Typography>
        <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
          Turn on Bluetooth and retry
        </Typography>
      </>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 3,
        textAlign: 'center',
      }}
    >
      <div>
        {content}
        <Button
          disabled={isConnecting}
          onClick={() => dispatch(addDevice())}
          variant="contained"
          size="large"
        >
          Connect
        </Button>
      </div>
    </Box>
  );
}
