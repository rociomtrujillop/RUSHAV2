import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // Importa el proveedor

import 'bootstrap/dist/css/bootstrap.min.css'; 
import './styles.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App /> 
    </AuthProvider>
  </React.StrictMode>,
);