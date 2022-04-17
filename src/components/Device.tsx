import { useAppDispatch } from '../app/hooks';
import { DeviceInfo, disconnectDevice, setMode } from '../features/devices/devicesSlice';
import { Button, Card, CardContent, CardHeader, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { BatteryIcon } from './BatteryIcon';
import { modeNames } from '../features/devices/constants';

type DeviceParams = {
  device: DeviceInfo;
};

export function Device({ device }: DeviceParams) {
  const dispatch = useAppDispatch();

  const handleDisconnectClick = () => dispatch(disconnectDevice(device.name));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card>
      <CardHeader
        title={device.name}
        action={
          <Button color="inherit" onClick={handleDisconnectClick}>
            Disconnect
          </Button>
        }
      />
      <CardContent>
        {device.batteryLevel && (
          <div>
            <BatteryIcon level={device.batteryLevel!} /> {device.batteryLevel}%
          </div>
        )}
        {device.mode && (
          <div>
            Mode: <Button onClick={handleClick}>{modeNames[device.mode]}</Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {Object.keys(modeNames).map((key) => (
                <MenuItem
                  key={key}
                  onClick={() => {
                    dispatch(setMode({ name: device.name, mode: parseInt(key) }));
                    handleClose();
                  }}
                >
                  {modeNames[parseInt(key)]}
                </MenuItem>
              ))}
            </Menu>
          </div>
        )}
        {device.color1 && (
          <div>
            Color1: {device.color1?.join(', ')}
            <div
              style={{
                background: `rgb(${device.color1?.join(', ')})`,
                height: 20,
                width: 20,
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
