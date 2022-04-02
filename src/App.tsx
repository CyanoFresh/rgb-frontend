import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function TopBar() {
  return (
    <AppBar position="sticky" color="transparent">
      <Toolbar />
    </AppBar>
  );
}

function Content() {
  return <div />;
}

function App() {
  return (
    <>
      <TopBar />
      <Content />
    </>
  );
}

export default App;
