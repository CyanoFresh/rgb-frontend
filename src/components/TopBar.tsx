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
  selectCurrentDevice,
  selectDevice,
} from '../features/devices/devicesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { BatteryIcon } from './BatteryIcon';

export function TopBar() {
  const currentDevice = useAppSelector(selectCurrentDevice);
  const devices = useAppSelector((state) => state.devices.devices);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();

  const open = Boolean(anchorEl);

  const openMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    dispatch(selectDevice(index));
    closeMenu();
  };
  const closeMenu = () => setAnchorEl(null);

  return (
    <AppBar position="sticky" color="transparent">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BatteryIcon level={currentDevice.batteryLevel} />
          <Typography fontWeight="bold">{currentDevice.batteryLevel}%</Typography>
        </Box>

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
          }}
        >
          {devices.map((device, index) => (
            <MenuItem
              key={device.name}
              selected={device === currentDevice}
              onClick={(event) => handleMenuItemClick(event, index)}
              disableGutters
            >
              {/* TODO: add battery and mode+color */}
              <ListItemText
                disableTypography
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  pl: 2.5,
                }}
              >
                {device.name}
              </ListItemText>
              <IconButton onClick={() => dispatch(disconnectDevice(device))}>
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
