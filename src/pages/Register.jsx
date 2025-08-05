// Importujemy React i hooki do obsługi formularza
import React, { useState } from 'react';
// Importujemy nawigację, żeby po rejestracji przejść do /login
import { useNavigate, Link } from 'react-router-dom';
// Importujemy funkcję rejestracji użytkownika z serwisu
import { registerUser } from '../utils/userService';

// Prosty helper do walidacji e-maila (regex)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  // Stan pól formularza (kontrolowane inputy)
  const [name, setName] = useState('');           // Imię/Nick użytkownika
  const [email, setEmail] = useState('');         // Adres e-mail
  const [password, setPassword] = useState('');   // Hasło
  const [confirm, setConfirm] = useState('');     // Powtórzenie hasła

  // Stan komunikatów o błędach (dla każdego pola)
  const [errors, setErrors] = useState({});       // Np. { email: 'Niepoprawny email' }

  // Stan komunikatów globalnych (np. błąd rejestracji)
  const [formError, setFormError] = useState(''); // Wiadomość dla całego formularza

  // Hook do nawigacji (przekierowanie po sukcesie)
  const navigate = useNavigate();

  // Funkcja walidująca dane (zwraca obiekt błędów)
  const validate = () => {
    const newErrors = {};

    // Walidacja imienia (min 2 znaki)
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Imię/nick musi mieć co najmniej 2 znaki.';
    }

    // Walidacja emaila (regex)
    if (!emailRegex.test(email)) {
      newErrors.email = 'Podaj poprawny adres e-mail.';
    }

    // Walidacja hasła (min 6 znaków, możesz łatwo rozszerzyć)
    if (password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków.';
    }

    // Sprawdzenie zgodności haseł
    if (password !== confirm) {
      newErrors.confirm = 'Hasła muszą być takie same.';
    }

    return newErrors;
  };

  // Obsługa wysłania formularza
  const handleSubmit = (e) => {
    // Blokujemy domyślne odświeżenie strony
    e.preventDefault();

    // Czyścimy globalny błąd
    setFormError('');

    // Walidujemy pola
    const v = validate();
    setErrors(v);

    // Jeśli są błędy -> przerywamy
    if (Object.keys(v).length > 0) return;

    // Próbujemy zarejestrować użytkownika
    const res = registerUser({ name: name.trim(), email: email.trim(), password });

    // Jeśli serwis zwrócił błąd (np. e-mail zajęty), pokaż go
    if (!res.ok) {
      setFormError(res.error || 'Nie udało się zarejestrować.');
      return;
    }

    // Sukces! Przekierowanie do strony logowania
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 420, margin: '24px auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* Nagłówek formularza */}
      <h1 style={{ marginTop: 0 }}>Rejestracja</h1>

      {/* Globalny błąd formularza (np. e-mail zajęty) */}
      {formError && (
        <div style={{ background: '#ffe6e6', border: '1px solid #ffb3b3', color: '#a30000', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
          {formError}
        </div>
      )}

      {/* Formularz rejestracji */}
      <form onSubmit={handleSubmit}>
        {/* Pole: Imię/Nick */}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: 6 }}>Imię / Nick</label>
          <input
            id="name"                // id powiązane z label
            type="text"              // typ tekst
            value={name}             // wartość kontrolowana przez state
            onChange={(e) => setName(e.target.value)}  // aktualizacja state przy wpisywaniu
            placeholder="np. Dorian"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          {/* Komunikat błędu pod polem */}
          {errors.name && <small style={{ color: 'crimson' }}>{errors.name}</small>}
        </div>

        {/* Pole: E-mail */}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 6 }}>E-mail</label>
          <input
            id="email"
            type="email"            // typ email (prosta walidacja po stronie przeglądarki)
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="np. dorian@example.com"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          {errors.email && <small style={{ color: 'crimson' }}>{errors.email}</small>}
        </div>

        {/* Pole: Hasło */}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 6 }}>Hasło</label>
          <input
            id="password"
            type="password"         // ukrywa wpisywane znaki
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="minimum 6 znaków"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          {errors.password && <small style={{ color: 'crimson' }}>{errors.password}</small>}
        </div>

        {/* Pole: Powtórz hasło */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="confirm" style={{ display: 'block', marginBottom: 6 }}>Powtórz hasło</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="wpisz ponownie hasło"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          {errors.confirm && <small style={{ color: 'crimson' }}>{errors.confirm}</small>}
        </div>

        {/* Przycisk wyślij */}
        <button
          type="submit"             // submit odpali handleSubmit
          style={{ width: '100%', padding: 12, borderRadius: 10, border: 0, background: '#0a58ca', color: '#fff', fontWeight: 600 }}
        >
          Zarejestruj się
        </button>
      </form>

      {/* Link pod formularzem do logowania */}
      <p style={{ marginTop: 12 }}>
        Masz już konto?{' '}
        <Link to="/login">Zaloguj się</Link>
      </p>
    </div>
  );
}

export default Register;
