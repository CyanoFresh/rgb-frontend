import { useAppDispatch, useAppSelector } from '../app/hooks';
import { closeNotification } from '../features/notification/notificationSlice';
import { Alert, Snackbar } from '@mui/material';
import React from 'react';

export function Notification() {
  const { open, message, type } = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeNotification());

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
