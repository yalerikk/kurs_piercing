import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/main.css'; // Подключите ваш CSS файл

// Stores
import UserStore from './store/UserStore';
import ServiceStore from './store/ServiceStore';

export const Context = createContext(null);
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Context.Provider value={{
      user: new UserStore(),
      service: new ServiceStore()
    }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);