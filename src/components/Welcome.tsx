import { Button, Typography } from '@mui/material';
import { addDevice } from '../features/devices/devicesSlice';
import { useAppDispatch } from '../app/hooks';

export function Welcome() {
  const dispatch = useAppDispatch();

  return (
    <>
      <Typography variant="h6">Welcome</Typography>
      <Typography variant="body1">Turn on Bluetooth and connect a new device</Typography>
      <Button onClick={() => dispatch(addDevice())} variant="contained">
        Connect
      </Button>
    </>
  );
}
