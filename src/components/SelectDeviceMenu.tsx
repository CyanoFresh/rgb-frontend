import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  DeviceInfo,
  disconnectDevice,
  selectCurrentDevice,
  selectDevice,
} from '../features/devices/devicesSlice';
import React, { MouseEvent } from 'react';
import { Box, Button, IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';

interface DeviceMenuItemProps {
  device: DeviceInfo;
  index: number;
  closeMenu: () => void;
}

function DeviceMenuItem({ device, index, closeMenu }: DeviceMenuItemProps) {
  const currentDevice = useAppSelector(selectCurrentDevice);
  const dispatch = useAppDispatch();

  const handleMenuItemClick = (event: MouseEvent, index: number) => {
    dispatch(selectDevice(index));
    closeMenu();
  };
  const handleDisconnectClick = (device: DeviceInfo) => (e: MouseEvent) => {
    e.stopPropagation();
    dispatch(disconnectDevice(device));
  };

  return (
    <MenuItem
      key={device.name}
      selected={device === currentDevice}
      onClick={(event) => handleMenuItemClick(event, index)}
      disableGutters
      sx={{
        padding: 0,
      }}
    >
      {/* TODO: add battery */}
      <Box
        sx={{
          padding: 1,
          borderRadius: '50%',
          background: `rgb(${device.color1.join(',')})`,
          ml: 2,
          mr: 1,
        }}
      />
      <ListItemText
        disableTypography
        sx={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '0.875rem',
          lineHeight: 1,
          py: '20px',
        }}
      >
        {device.name}
      </ListItemText>
      <Box
        sx={{
          fontSize: 12,
          lineHeight: 1,
          fontWeight: 'bold',
        }}
      >
        {device.batteryLevel}%
      </Box>
      <IconButton onClick={handleDisconnectClick(device)} sx={{ pr: 2 }}>
        <CloseIcon />
      </IconButton>
    </MenuItem>
  );
}

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
        PaperProps={{
          sx: {
            minWidth: 270,
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
        sx={{
          '& .MuiMenu-paper': {
            borderRadius: 4,
          },
          '& .MuiMenu-list': {
            padding: 0,
          },
          '& .MuiMenu-list .Mui-selected': {
            // padding: 20,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          },
          '& .MuiMenu-list .MuiIconButton-root': {
            color: 'inherit',
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
