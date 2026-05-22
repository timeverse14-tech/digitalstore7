import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { 
            background: '#13131a', 
            color: '#f1f5f9', 
            border: '1px solid rgba(168,85,247,0.2)' 
          } 
        }} 
      />
    </BrowserRouter>
  </React.StrictMode>
);
