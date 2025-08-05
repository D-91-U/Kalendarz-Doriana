import React, { useEffect, useMemo, useState } from 'react';
// Serwis wydarzeń (CRUD)
import { getMyEvents, addEvent, removeEvent } from '../utils/eventService';
// Guard (jeśli używasz ProtectedRoute w App – możesz pominąć tu logikę sesji)
// Gdy nie masz guardów, można wczytać sesję i pokazać komunikat:
import { getSession } from '../utils/userService';

export default function Calendar() {
  // Pola formularza dodawania
  const [title, setTitle] = useState('');         // tytuł wydarzenia
  const [date, setDate] = useState('');           // data YYYY-MM-DD
  const [type, setType] = useState('family');     // family | logistics
  const [description, setDescription] = useState(''); // opcjonalnie

  // Błąd formularza
  const [formError, setFormError] = useState('');
  // Lista moich wydarzeń (wczytamy z localStorage)
  const [events, setEvents] = useState([]);
  // Filtr widoku
  const [filter, setFilter] = useState('all');    // all | family | logistics

  // (opcjonalne) sprawdzenie, czy zalogowany
  const session = getSession();

  // Po pierwszym renderze – wczytaj wydarzenia
  useEffect(() => {
    // jeśli brak sesji – nie ładuj (lub można redirectować na /login w App)
    if (!session?.email) return;
    setEvents(getMyEvents());
  }, [session?.email]);

  // Wyliczamy przefiltrowaną listę (memo = nie licz za każdym renderem)
  const filtered = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter(e => e.type === filter);
  }, [events, filter]);

  // Obsługa dodania wydarzenia
  const handleAdd = (e) => {
    e.preventDefault();          // bez przeładowania strony
    setFormError('');            // czyścimy błąd

    // Wywołujemy serwis – doda event i zapisze
    const res = addEvent({ title, date, type, description });
    if (!res.ok) {
      // jeśli błąd walidacji lub brak sesji
      setFormError(res.error || 'Nie udało się dodać wydarzenia.');
      return;
    }

    // Po sukcesie: odśwież listę + wyczyść formularz
    setEvents(getMyEvents());
    setTitle('');
    setDate('');
    setType('family');
    setDescription('');
  };

  // Usuwanie wydarzenia
  const handleRemove = (id) => {
    const res = removeEvent(id);
    if (!res.ok) {
      alert(res.error || 'Nie udało się usunąć wydarzenia.');
      return;
    }
    setEvents(getMyEvents());
  };

  // Gdy brak zalogowania – pokaż info (jeśli nie używasz ProtectedRoute)
  if (!session?.email) {
    return <p>Musisz być zalogowany, aby zobaczyć kalendarz.</p>;
  }

  return (
    <div style={{ maxWidth: 920, margin: '24px auto', display: 'grid', gap: 20 }}>
      {/* FORMULARZ DODAWANIA */}
      <section style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ marginTop: 0 }}>Dodaj wydarzenie</h2>

        {formError && (
          <div style={{ background: '#ffe6e6', border: '1px solid #ffb3b3', color: '#a30000', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleAdd} style={{ display: 'grid', gap: 12 }}>
          {/* Tytuł */}
          <div>
            <label htmlFor="title">Tytuł</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="np. Urodziny / Załadunek w Berlinie"
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
            />
          </div>

          {/* Data */}
          <div>
            <label htmlFor="date">Data</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
            />
          </div>

          {/* Typ wydarzenia */}
          <div>
            <label htmlFor="type">Typ</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
            >
              <option value="family">Rodzinne</option>
              <option value="logistics">Spedycja</option>
            </select>
          </div>

          {/* Opis (opcjonalnie) */}
          <div>
            <label htmlFor="description">Opis (opcjonalnie)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="np. Adres, godzina, osoba kontaktowa..."
              rows={3}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
            />
          </div>

          <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: '#0a58ca', color: '#fff', fontWeight: 600 }}>
            Dodaj
          </button>
        </form>
      </section>

      {/* LISTA + FILTR */}
      <section style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Twoje wydarzenia</h2>

          {/* Filtr: wszystkie / rodzinne / spedycja */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
          >
            <option value="all">Wszystkie</option>
            <option value="family">Rodzinne</option>
            <option value="logistics">Spedycja</option>
          </select>
        </header>

        {/* Lista wydarzeń */}
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 16, display: 'grid', gap: 12 }}>
          {filtered.length === 0 && <li>Brak wydarzeń w tym filtrze.</li>}

          {filtered
            // sort po dacie rosnąco
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(ev => (
              <li key={ev.id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, display: 'grid', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
                  <strong>{ev.title}</strong>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 999,
                      fontSize: 12,
                      background: ev.type === 'family' ? '#e8f3ff' : '#eafbea',
                      border: `1px solid ${ev.type === 'family' ? '#b5d6ff' : '#b9efc4'}`,
                    }}
                  >
                    {ev.type === 'family' ? 'Rodzinne' : 'Spedycja'}
                  </span>
                </div>

                <div style={{ fontSize: 14, color: '#666' }}>
                  {ev.date} {ev.description ? `• ${ev.description}` : ''}
                </div>

                <div>
                  <button
                    onClick={() => handleRemove(ev.id)}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}