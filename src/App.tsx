import React, { useEffect } from 'react';
import {
  AppBar,
  Button,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { requestDevice } from './features/device/deviceSlice';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function Menu() {
  const { requestStatus, devices, error } = useAppSelector(
    (state) => state.device
  );
  const dispatch = useAppDispatch();

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" color="inherit" component="div">
          {devices.map((device) => (
            <div key={device.id}>{device.id}</div>
          ))}
        </Typography>
        <IconButton color="inherit" onClick={() => dispatch(requestDevice())}>
          <Add />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

function Content() {
  const devices = useAppSelector((state) => state.device.devices);
  const dispatch = useAppDispatch();

  return (
    <div>
      {!Boolean(devices.length) && (
        <>
          <Typography variant="h6">No devices are connected</Typography>
          <Button variant="contained" onClick={() => dispatch(requestDevice())}>
            Connect
          </Button>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <>
      <CssBaseline />
      <Menu />
      <Content />
    </>
  );
}

export default App;
