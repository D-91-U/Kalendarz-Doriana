// Serwis do operacji na użytkownikach (rejestracja, pobranie listy)
// Używa helperów z storage.js
import { getItem, setItem } from './storage';

// Stałe klucze localStorage, żeby nie pomylić nazw
const USERS_KEY = 'users';        // lista wszystkich użytkowników
const SESSION_KEY = 'session';    // aktualnie zalogowany użytkownik

// Pobiera listę wszystkich użytkowników (tablica obiektów)
export function getAllUsers() {
  // Jeśli nie ma nic w localStorage, zwróci pustą tablicę
  return getItem(USERS_KEY, []);
}

// Zapisuje całą listę użytkowników
export function saveAllUsers(users) {
  setItem(USERS_KEY, users);
}

// Dodaje nowego użytkownika (jeśli e-mail nie jest zajęty)
// Zwraca obiekt: { ok: true } albo { ok: false, error: '...' }
export function registerUser({ name, email, password }) {
  // Bierzemy aktualną listę
  const users = getAllUsers();

  // Czy użytkownik o takim mailu już istnieje?
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { ok: false, error: 'Użytkownik z takim adresem e-mail już istnieje.' };
  }

  // Tworzymy prosty obiekt użytkownika (bez haseł szyfrowanych, bo to demo!)
  const newUser = {
    id: crypto.randomUUID(), // unikalny identyfikator (wspierany w nowoczesnych przeglądarkach)
    name,
    email,
    password, // UWAGA: w prawdziwej aplikacji tego NIE trzymamy w plain text
    createdAt: new Date().toISOString(),
  };

  // Dodajemy do tablicy i zapisujemy
  users.push(newUser);
  saveAllUsers(users);

  return { ok: true };
}

// Ustawia "sesję" (np. po zalogowaniu); tu użyjemy później
export function setSession(email) {
  setItem(SESSION_KEY, { email, loginAt: new Date().toISOString() });
}

// Pobiera aktualną sesję (albo null)
export function getSession() {
  return getItem(SESSION_KEY, null);
}

// Czyści sesję (wylogowanie)
export function clearSession() {
  setItem(SESSION_KEY, null);
}