import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { addDevice } from '../features/devices/devicesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import React from 'react';

export function Welcome() {
  const isConnecting = useAppSelector((state) => state.devices.connecting);
  const dispatch = useAppDispatch();

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
        {isConnecting ? (
          <>
            <CircularProgress size="5rem" sx={{ mb: 5 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Connecting...
            </Typography>
            <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
              Turn on Bluetooth and select RGB controller device
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Welcome
            </Typography>
            <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
              Turn on Bluetooth and connect first device
            </Typography>
          </>
        )}
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
