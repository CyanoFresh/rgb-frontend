import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  DeviceInfo,
  disconnectDevice,
  selectCurrentDevice,
  selectDevice,
} from '../../features/devices/devicesSlice';
import React, { MouseEvent } from 'react';
import { Box, IconButton, ListItemText, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DeviceMenuItemProps {
  device: DeviceInfo;
  index: number;
  closeMenu: () => void;
}

export function DeviceMenuItem({ device, index, closeMenu }: DeviceMenuItemProps) {
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
        '&.Mui-selected': {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        },
        '&.Mui-selected:hover': {
          backgroundColor: 'primary.dark',
        },
        '& .MuiIconButton-root': {
          color: 'inherit',
        },
      }}
    >
      <Box
        sx={{
          padding: 1,
          borderRadius: '50%',
          background: `hsl(${device.color1[0]}, ${device.color1[1]}%, ${device.color1[2]}%)`,
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
          py: 2.5,
        }}
      >
        {device.name}
      </ListItemText>
      <Box
        sx={{
          fontSize: '0.8rem',
          lineHeight: 1,
          fontWeight: 'bold',
        }}
      >
        {device.batteryLevel}%
      </Box>
      <IconButton onClick={handleDisconnectClick(device)} sx={{ pr: 1.5 }}>
        <CloseIcon />
      </IconButton>
    </MenuItem>
  );
}
