import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Content } from './Content';
import { TopBar } from './TopBar';
import { Notification } from './Notification';

function App() {
  return (
    <>
      <TopBar />
      <Content />
      <Notification />
    </>
  );
}

export default App;
