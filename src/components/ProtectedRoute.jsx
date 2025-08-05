// Komponent bramkujący dostęp do chronionych tras
import React from 'react';
// Import do nawigacji/redirectu
import { Navigate } from 'react-router-dom';
// Funkcja pobierająca aktualną sesję użytkownika
import { getSession } from '../utils/userService';

// ProtectedRoute przyjmuje children (komponent/widok)
function ProtectedRoute({ children }) {
  // Pobieramy sesję (null, jeśli nikt nie jest zalogowany)
  const session = getSession();

  // Jeśli nie ma sesji — przekieruj na /login
  if (!session || !session.email) {
    return <Navigate to="/login" replace />;
  }

  // Jeśli jest sesja — pokaż chroniony widok
  return children;
}

export default ProtectedRoute;