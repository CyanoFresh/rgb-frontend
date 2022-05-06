import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { theme } from './app/theme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// https://bit.ly/CRA-PWA
// TODO: register in production
serviceWorkerRegistration.unregister();

// https://bit.ly/CRA-vitals
reportWebVitals();
