import React from "react";
import { Provider } from 'react-redux';
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SocketProvider } from './context/SocketProvider'
import store from "./store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <SocketProvider>
      <App />
    </SocketProvider>
    </Provider>
  </React.StrictMode>
);
