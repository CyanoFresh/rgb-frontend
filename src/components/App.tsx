import React from 'react';
import { Content } from './Content';
import { TopBar } from './TopBar';
import { Notification } from './Notification';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../app/theme';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <TopBar />
      <Content />
      <Notification />
    </ThemeProvider>
  );
}

export default App;
