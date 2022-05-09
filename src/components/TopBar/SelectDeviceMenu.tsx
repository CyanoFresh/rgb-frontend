import { useAppSelector } from '../../app/hooks';
import { selectCurrentDevice } from '../../features/devices/devicesSlice';
import React from 'react';
import { Button, Menu } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DeviceMenuItem } from './DeviceMenuItem';

export function SelectDeviceMenu() {
  const devices = useAppSelector((state) => state.devices.devices);
  const currentDevice = useAppSelector(selectCurrentDevice);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const openMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  return (
    <>
      <Button
        onClick={openMenu}
        endIcon={<KeyboardArrowDownIcon />}
        color="inherit"
        sx={{ fontWeight: 'bold' }}
      >
        {currentDevice.name}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        sx={{
          '& .MuiMenu-paper': {
            borderRadius: 4,
            minWidth: 270,
          },
          '& .MuiMenu-list': {
            padding: 0,
          },
        }}
      >
        {devices.map((device, index) => (
          <DeviceMenuItem
            key={device.name}
            device={device}
            index={index}
            closeMenu={closeMenu}
          />
        ))}
      </Menu>
    </>
  );
}
