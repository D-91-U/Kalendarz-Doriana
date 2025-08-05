// Serwis do obsługi wydarzeń: CRUD w localStorage + proste filtry

import { getItem, setItem } from './storage'; // nasz helper JSON/localStorage
import { getSession } from './userService';   // do przypisania eventów do zalogowanego

// Klucz w localStorage do przechowywania wydarzeń
const EVENTS_KEY = 'events';

/**
 * getAllEvents – pobiera WSZYSTKIE wydarzenia (tablica)
 * Każdy event ma sugerowaną strukturę:
 * {
 *   id: string,
 *   ownerEmail: string,   // do kogo należy (użyjemy zalogowanego użytkownika)
 *   title: string,
 *   date: string,         // format YYYY-MM-DD
 *   type: 'family'|'logistics', // tryb rodzinny / spedycyjny
 *   description?: string, // opcjonalny opis
 *   createdAt: string
 * }
 */
export function getAllEvents() {
  return getItem(EVENTS_KEY, []);
}

/** Zapisuje całą tablicę wydarzeń */
export function saveAllEvents(events) {
  setItem(EVENTS_KEY, events);
}

/** Zwraca wydarzenia zalogowanego użytkownika */
export function getMyEvents() {
  const session = getSession();
  const email = session?.email || '';
  const all = getAllEvents();
  // filtrowanie po właścicielu
  return all.filter(e => e.ownerEmail.toLowerCase() === email.toLowerCase());
}

/** Dodaje nowe wydarzenie przypisane do zalogowanego */
export function addEvent({ title, date, type, description = '' }) {
  const session = getSession();
  if (!session?.email) {
    return { ok: false, error: 'Brak zalogowanego użytkownika.' };
  }

  // Prosta walidacja
  if (!title || !title.trim()) return { ok: false, error: 'Tytuł jest wymagany.' };
  if (!date) return { ok: false, error: 'Data jest wymagana.' };
  if (!['family', 'logistics'].includes(type)) return { ok: false, error: 'Nieprawidłowy typ wydarzenia.' };

  // Tworzymy obiekt wydarzenia
  const ev = {
    id: crypto.randomUUID(),
    ownerEmail: session.email,
    title: title.trim(),
    date, // oczekujemy YYYY-MM-DD z <input type="date">
    type,
    description: description.trim(),
    createdAt: new Date().toISOString(),
  };

  // Zapis
  const all = getAllEvents();
  all.push(ev);
  saveAllEvents(all);

  return { ok: true, event: ev };
}

/** Usuwa wydarzenie po id (tylko własne) */
export function removeEvent(id) {
  const session = getSession();
  if (!session?.email) return { ok: false, error: 'Brak zalogowania.' };

  const all = getAllEvents();
  const next = all.filter(e => !(e.id === id && e.ownerEmail === session.email));
  saveAllEvents(next);

  return { ok: true };
}