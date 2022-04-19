import { Box, Button, Typography } from '@mui/material';
import { addDevice } from '../features/devices/devicesSlice';
import { useAppDispatch } from '../app/hooks';

export function Welcome() {
  const dispatch = useAppDispatch();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 3,
      }}
    >
      <div>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Welcome
        </Typography>
        <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
          Turn on Bluetooth and connect a new device
        </Typography>
        <Button onClick={() => dispatch(addDevice())} variant="round" size="large">
          Connect
        </Button>
      </div>
    </Box>
  );
}
