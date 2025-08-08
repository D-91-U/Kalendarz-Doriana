// === WIDOK KALENDARZA W SIATCE (GRID) Z DODAWANIEM I EDYCJĄ WYDARZEŃ ===
// Ten komponent pokazuje kalendarz miesiąca w układzie 7 kolumn (dni tygodnia).
// - Kliknięcie w dzień otwiera modal dodawania wydarzenia dla tej daty.
// - Kliknięcie w istniejący tytuł wydarzenia otwiera modal edycji (zmiana tytułu, typu, opisu, daty).
// - Dzisiejsza data jest wyróżniona obwódką i tłem.

import React, { useMemo, useState } from 'react';

// Importujemy pomocnicze funkcje do pracy z datami (liczba dni w miesiącu, ile pustych pól na początku, formatowanie)
import { daysInMonth, leadingEmptyDays, monthLabel, toISO } from '../utils/dateUtils';

// Importujemy funkcje do pracy z wydarzeniami (pobranie moich eventów, dodanie, aktualizacja)
import { getMyEvents, addEvent, updateEvent } from '../utils/eventService';

// Importujemy informację o sesji (czy użytkownik jest zalogowany)
import { getSession } from '../utils/userService';

// Import styli kalendarza (grid, kolory, modal)
import '../styles/calendar.css';

export default function Calendar() {
  // --- USTAWIENIE DOMYŚLNEGO WIDOKU MIESIĄCA (BIEŻĄCY) ---
  const now = new Date();                       // Aktualna data (dziś)
  const [year, setYear] = useState(now.getFullYear()); // Rok bieżącego widoku
  const [month, setMonth] = useState(now.getMonth());  // Miesiąc bieżącego widoku (0-11)

  // --- SPRAWDZENIE SESJI (jeśli nie zalogowany, nie pokazujemy kalendarza) ---
  const session = getSession();

  // --- POBRANIE MOICH WYDARZEŃ Z LOCALSTORAGE ---
  // Uproszczenie: za każdym renderem bierzemy aktualną listę (to wystarczy dla MVP).
  const myEvents = getMyEvents();

  // --- OBLICZENIA DLA GRIDU MIESIĄCA ---
  const empty = leadingEmptyDays(year, month);  // Ile "pustych" pól przed 1-szym dniem?
  const count = daysInMonth(year, month);       // Ile dni ma ten miesiąc?

  // Tworzymy tablicę dni [1..count], żeby wygodnie je zmapować w JSX
  const days = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count]);

  // --- STAN MODALA (WSPÓLNY DLA DODAWANIA I EDYCJI) ---
  const [modalOpen, setModalOpen] = useState(false);   // Czy modal jest otwarty?
  const [editMode, setEditMode] = useState(false);     // false = dodawanie, true = edycja
  const [editingEvent, setEditingEvent] = useState(null); // Obiekt edytowanego eventu (gdy edycja)

  // --- STAN FORMULARZA W MODALU ---
  const [selectedDate, setSelectedDate] = useState(''); // YYYY-MM-DD — dla którego dnia dodajemy/edytujemy
  const [title, setTitle] = useState('');               // Tytuł wydarzenia
  const [type, setType] = useState('family');           // Typ: 'family' (rodzinne) lub 'logistics' (spedycja)
  const [description, setDescription] = useState('');   // Opis (opcjonalnie)
  const [formError, setFormError] = useState('');       // Komunikat błędu (np. brak tytułu)

  // --- FUNKCJE DO OTWARCIA MODALA ---

  // Kliknięcie w pusty dzień -> otwieramy modal DODAWANIA (czyści pola)
  const openAddModal = (iso) => {
    setSelectedDate(iso);   // ustawiamy datę wybranego dnia
    setTitle('');           // czysty tytuł
    setType('family');      // domyślnie "rodzinne"
    setDescription('');     // czysty opis
    setFormError('');       // brak błędu
    setEditMode(false);     // tryb DODAWANIA
    setEditingEvent(null);  // brak edytowanego eventu
    setModalOpen(true);     // otwórz modal
  };

  // Kliknięcie w istniejący tytuł wydarzenia -> otwieramy modal EDYCJI z wypełnionymi polami
  const openEditModal = (eventObj) => {
    setEditingEvent(eventObj);              // zapamiętujemy, który event edytujemy
    setSelectedDate(eventObj.date);         // data tego eventu
    setTitle(eventObj.title);               // tytuł tego eventu
    setType(eventObj.type);                 // typ (family/logistics)
    setDescription(eventObj.description || ''); // opis (może być pusty)
    setFormError('');                       // brak błędu
    setEditMode(true);                      // tryb EDYCJI
    setModalOpen(true);                     // otwórz modal
  };

  // --- ZAPIS W MODALU (DODAWANIE LUB AKTUALIZACJA) ---
  const handleSave = (e) => {
    e.preventDefault(); // blokujemy pełne odświeżenie strony

    // Prosta walidacja
    if (!title.trim()) {
      setFormError('Tytuł jest wymagany.');
      return;
    }
    if (!selectedDate) {
      setFormError('Data jest wymagana.');
      return;
    }

    if (editMode && editingEvent) {
      // Tryb EDYCJI: aktualizujemy istniejący event
      const res = updateEvent({
        ...editingEvent,           // bazujemy na tym, co było
        title: title.trim(),       // nadpisujemy polami z formularza
        type,
        description: description.trim(),
        date: selectedDate,
      });
      if (!res.ok) {
        setFormError(res.error || 'Nie udało się zaktualizować wydarzenia.');
        return;
      }
    } else {
      // Tryb DODAWANIA: tworzymy nowy event dla zalogowanego użytkownika
      const res = addEvent({
        title: title.trim(),
        date: selectedDate,
        type,
        description: description.trim(),
      });
      if (!res.ok) {
        setFormError(res.error || 'Nie udało się dodać wydarzenia.');
        return;
      }
    }

    // Sukces -> zamykamy modal; lista odświeży się przy kolejnym renderze (pobieramy myEvents na bieżąco)
    setModalOpen(false);
  };

  // --- NAWIGACJA PO MIESIĄCACH (poprzedni/następny) ---
  const prevMonth = () => {
    // Jeśli jesteśmy w styczniu, cofamy rok i ustawiamy miesiąc na grudzień
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    // Jeśli jesteśmy w grudniu, zwiększamy rok i ustawiamy miesiąc na styczeń
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // --- OCHRONA DOSTĘPU: jeśli nikt nie jest zalogowany, nie pokazujemy kalendarza ---
  if (!session?.email) {
    return <p>Musisz być zalogowany, aby zobaczyć kalendarz.</p>;
  }

  // --- DANE POMOCNICZE DO RENDERU ---
  const label = monthLabel(year, month); // np. "sierpień 2025" po polsku
  const DOW = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']; // dni tygodnia (nagłówki)
  const todayISO = toISO(now.getFullYear(), now.getMonth(), now.getDate()); // dzisiejsza data YYYY-MM-DD

  return (
    <div className="calendar-wrap">
      {/* NAGŁÓWEK KALENDARZA: nazwa miesiąca + przyciski nawigacji */}
      <div className="calendar-header">
        <button onClick={prevMonth}>&larr; Poprzedni</button>
        <h2 style={{ margin: 0 }}>{label}</h2>
        <button onClick={nextMonth}>Następny &rarr;</button>
      </div>

      {/* PASEK Z NAGŁÓWKAMI DNI TYGODNIA */}
      <div className="calendar-grid">
        {DOW.map((d) => (
          <div className="calendar-dow" key={d}>{d}</div>
        ))}
      </div>

      {/* WŁAŚCIWY GRID KALENDARZA (puste komórki + dni miesiąca) */}
      <div className="calendar-grid">
        {/* 1) Puste komórki przed pierwszym dniem miesiąca (żeby Pon był zawsze w pierwszej kolumnie) */}
        {Array.from({ length: empty }).map((_, i) => (
          <div className="calendar-cell" key={`empty-${i}`} aria-hidden="true" />
        ))}

        {/* 2) Kolejne dni miesiąca */}
        {days.map((day) => {
          // ISO aktualnego boxa dnia (np. "2025-08-06")
          const iso = toISO(year, month, day);

          // Czy to dzisiaj? Jeśli tak, dodamy klasę wyróżniającą
          const isToday = iso === todayISO;

          // Eventy bieżącego użytkownika dla tego dnia (posortowane wg typu)
          const dayEvents = myEvents
            .filter((ev) => ev.date === iso) // <-- UPEWNIJ SIĘ, ŻE MASZ SPACJĘ PO ===
            .sort((a, b) => a.type.localeCompare(b.type));

          return (
            <div
              key={iso}
              className={`calendar-cell ${isToday ? 'calendar-today' : ''}`} // jeśli dziś -> dodatkowa klasa
              // Kliknięcie w kafelek dnia otwiera modal DODAWANIA
              onClick={() => openAddModal(iso)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' ? openAddModal(iso) : null)}
            >
              {/* numer dnia (np. "6") */}
              <div className="calendar-daynum">{day}</div>

              {/* Lista eventów upchnięta w kafelku dnia */}
              <div style={{ display: 'grid', gap: 4 }}>
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    title={ev.description || ev.title}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {/* Odznaka typu wydarzenia: R (rodzinne) / S (spedycja) */}
                    <span className={`badge ${ev.type === 'family' ? 'badge-family' : 'badge-logistics'}`}>
                      {ev.type === 'family' ? 'R' : 'S'}
                    </span>

                    {/* Tytuł wydarzenia — KLIK = EDYCJA (otwieramy modal w trybie edycji) */}
                    <span
                      className="event-title"
                      onClick={(e) => {
                        e.stopPropagation(); // zatrzymujemy, żeby klik w tytuł nie odpalał dodawania
                        openEditModal(ev);   // otwieramy modal edycji
                      }}
                    >
                      {ev.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL (wspólny do dodawania i edycji) */}
      {modalOpen && (
        // Szare tło na cały ekran
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          {/* Sam modal — klik w niego nie zamyka (stopPropagation) */}
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* Nagłówek modala: pokazujemy datę i tryb */}
            <h3 style={{ margin: 0 }}>
              {editMode ? 'Edytuj wydarzenie' : 'Dodaj wydarzenie'} — {selectedDate}
            </h3>

            {/* Jeżeli jest błąd walidacji/zapisu, pokaż go w czerwonym boxie */}
            {formError && (
              <div style={{ background: '#ffe6e6', border: '1px solid #ffb3b3', color: '#a30000', padding: '8px 12px', borderRadius: 8 }}>
                {formError}
              </div>
            )}

            {/* Formularz w modalu (tytuł, typ, opis) */}
            <form onSubmit={handleSave} style={{ display: 'grid', gap: 10 }}>
              {/* Tytuł wydarzenia */}
              <div>
                <label htmlFor="title">Tytuł</label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="np. Urodziny / Załadunek"
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
                  autoFocus
                />
              </div>

              {/* Typ wydarzenia */}
              <div>
                <label htmlFor="type">Typ</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
                >
                  <option value="family">Rodzinne</option>
                  <option value="logistics">Spedycja</option>
                </select>
              </div>

              {/* Opis wydarzenia (opcjonalnie) */}
              <div>
                <label htmlFor="description">Opis (opcjonalnie)</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
                  placeholder="np. adres, godzina, kontakt"
                />
              </div>

              {/* Przyciski: Anuluj / Zapisz */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
                >
                  Anuluj
                </button>

                <button
                  type="submit"
                  style={{ padding: '10px 12px', borderRadius: 8, border: 0, background: '#0a58ca', color: '#fff', fontWeight: 600 }}
                >
                  {editMode ? 'Zapisz zmiany' : 'Dodaj'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}