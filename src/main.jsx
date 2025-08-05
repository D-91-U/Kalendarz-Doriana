// Importujemy React (wymagane do JSX)
import React from 'react';
// Import do montowania aplikacji w <div id="root">
import ReactDOM from 'react-dom/client';
// Import Routera do obsługi nawigacji między stronami
import { BrowserRouter } from 'react-router-dom';
// Import głównego komponentu aplikacji
import App from './App.jsx';
// Import globalnych stylów (zaraz stworzymy plik)
import './styles/index.css';

// Szukamy w index.html elementu <div id="root"> i montujemy tam aplikację
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode pomaga wykrywać błędy w czasie developmentu
  <React.StrictMode>
    {/* BrowserRouter włącza routing w całej aplikacji */}
    <BrowserRouter>
      {/* Nasz główny komponent */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
