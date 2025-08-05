// Importujemy React i hooki do stanu
import React, { useState } from 'react';
// Importy do nawigacji i linków
import { useNavigate, Link } from 'react-router-dom';
// Funkcja logowania z serwisu użytkownika
import { loginUser } from '../utils/userService';

// Prosty regex do emaila (jak w rejestracji)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  // Stany dla pól formularza
  const [email, setEmail] = useState('');       // e-mail użytkownika
  const [password, setPassword] = useState(''); // hasło użytkownika

  // Błędy per pole
  const [errors, setErrors] = useState({});     // np. { email: '...' }
  // Błąd globalny (np. niepoprawne dane logowania)
  const [formError, setFormError] = useState('');

  // Do przekierowania po logowaniu
  const navigate = useNavigate();

  // Walidacja prostych reguł
  const validate = () => {
    const newErrors = {};
    // Email musi być poprawny
    if (!emailRegex.test(email)) {
      newErrors.email = 'Podaj poprawny adres e-mail.';
    }
    // Hasło przynajmniej 6 znaków
    if (password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków.';
    }
    return newErrors;
  };

  // Obsługa submit formularza
  const handleSubmit = (e) => {
    e.preventDefault();        // blokujemy odświeżenie strony
    setFormError('');          // czyścimy błąd globalny
    const v = validate();      // walidujemy
    setErrors(v);              // zapis błędów
    if (Object.keys(v).length > 0) return;  // jeśli są błędy -> stop

    // Próba logowania
    const res = loginUser({ email: email.trim(), password });
    if (!res.ok) {
      // Jeśli dane złe — pokaż błąd
      setFormError(res.error || 'Nie udało się zalogować.');
      return;
    }

    // Sukces — przekieruj na stronę główną / lub /calendar (gdy dodamy)
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 420, margin: '24px auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* Nagłówek */}
      <h1 style={{ marginTop: 0 }}>Logowanie</h1>

      {/* Błąd globalny (np. niepoprawne dane logowania) */}
      {formError && (
        <div style={{ background: '#ffe6e6', border: '1px solid #ffb3b3', color: '#a30000', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
          {formError}
        </div>
      )}

      {/* Formularz logowania */}
      <form onSubmit={handleSubmit}>
        {/* E-mail */}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 6 }}>E-mail</label>
          <input
            id="email"
            type="email"                // pole typu email
            value={email}               // wartość kontrolowana
            onChange={(e) => setEmail(e.target.value)} // aktualizacja stanu
            placeholder="np. dorian@example.com"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          {/* Komunikat błędu pod polem */}
          {errors.email && <small style={{ color: 'crimson' }}>{errors.email}</small>}
        </div>

        {/* Hasło */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 6 }}>Hasło</label>
          <input
            id="password"
            type="password"             // ukrywa wpisywane znaki
            value={password}            // wartość z state
            onChange={(e) => setPassword(e.target.value)} // aktualizacja stanu
            placeholder="minimum 6 znaków"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          {errors.password && <small style={{ color: 'crimson' }}>{errors.password}</small>}
        </div>

        {/* Przycisk logowania */}
        <button
          type="submit"                 // wyśle formularz -> handleSubmit
          style={{ width: '100%', padding: 12, borderRadius: 10, border: 0, background: '#0a58ca', color: '#fff', fontWeight: 600 }}
        >
          Zaloguj się
        </button>
      </form>

      {/* Link do rejestracji */}
      <p style={{ marginTop: 12 }}>
        Nie masz konta?{' '}
        <Link to="/register">Zarejestruj się</Link>
      </p>
    </div>
  );
}

export default Login;