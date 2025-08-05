// Prosty widok „po zalogowaniu”
import React from 'react';
// Importujemy dane z sesji (np. email) — opcjonalnie
import { getSession, clearSession } from '../utils/userService';
// Do nawigacji po wylogowaniu
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  // Pobieramy aktualną sesję
  const session = getSession();
  // Do przekierowania po wylogowaniu
  const navigate = useNavigate();

  // Funkcja wylogowania
  const handleLogout = () => {
    // Czyścimy sesję
    clearSession();
    // Przekierowujemy na stronę logowania
    navigate('/login');
  };

  return (
    <div>
      <h1>Panel / Kalendarz</h1>
      {/* Witajka z emailem z sesji */}
      <p>Witaj{session?.email ? `, ${session.email}` : ''}!</p>

      {/* Przyciski akcji (na razie tylko Wyloguj) */}
      <button
        onClick={handleLogout}   // po kliknięciu — wyloguj
        style={{ padding: '8px 12px', borderRadius: 8, border: 0, background: '#333', color: '#fff', fontWeight: 600 }}
      >
        Wyloguj
      </button>
    </div>
  );
}

export default Dashboard;