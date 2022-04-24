import {
  AppBar,
  Box,
  Button,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  addDevice,
  disconnectDevice,
  selectDevice,
} from '../features/devices/devicesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { BatteryIcon } from './BatteryIcon';

export function TopBar() {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const selectedDeviceIndex = useAppSelector(
    (state) => state.devices.selectedDeviceIndex,
  );
  const devices = useAppSelector((state) => state.devices.devices);

  const open = Boolean(anchorEl);
  const openMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    dispatch(selectDevice(index));
    handleClose();
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="sticky" color="transparent">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BatteryIcon level={56} />
          <Typography fontWeight="bold">56%</Typography>
        </Box>

        <Button
          onClick={openMenu}
          endIcon={<KeyboardArrowDownIcon />}
          color="inherit"
          sx={{ fontWeight: 'bold' }}
        >
          {devices[selectedDeviceIndex!].name}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              minWidth: 270,
            },
          }}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
        >
          {devices.map((device, index) => (
            <MenuItem
              key={device.name}
              selected={index === selectedDeviceIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              <ListItemText>{device.name}</ListItemText>
              <IconButton onClick={() => dispatch(disconnectDevice(device.name))}>
                <CloseIcon />
              </IconButton>
            </MenuItem>
          ))}
        </Menu>

        <IconButton color="inherit" onClick={() => dispatch(addDevice())}>
          <AddIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
