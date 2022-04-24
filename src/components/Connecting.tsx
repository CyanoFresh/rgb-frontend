import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React from 'react';

export function Connecting() {
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
        <CircularProgress size="5rem" sx={{ mb: 5 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Connecting...
        </Typography>
        <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
          Turn on Bluetooth and select RGB controller device
        </Typography>
        <Button disabled variant="contained" size="large">
          Connecting...
        </Button>
      </div>
    </Box>
  );
}
