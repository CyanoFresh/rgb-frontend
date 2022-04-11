import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// https://bit.ly/CRA-PWA
serviceWorkerRegistration.register();

// https://bit.ly/CRA-vitals
reportWebVitals();
