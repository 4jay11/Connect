import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./redux/store";
import Routers from './Routers';
import { ToastProvider } from "./context/ToastContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <Routers />
      </ToastProvider>
    </Provider>
  </React.StrictMode>
);