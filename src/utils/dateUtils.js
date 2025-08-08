// Zbiór prostych utili do pracy z miesiącem i dniami

// Zwraca YYYY-MM-01 dla danego roku/miesiąca (month: 0-11)
export function ymFirstISO(year, month) {
  // Tworzymy datę pierwszego dnia miesiąca
  const d = new Date(year, month, 1);
  // Zamieniamy na YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

// Ile dni ma miesiąc
export function daysInMonth(year, month) {
  // Dzień 0 następnego miesiąca to ostatni dzień bieżącego
  return new Date(year, month + 1, 0).getDate();
}

// Dni do wyświetlenia przed 1. dniem miesiąca (żeby siatka zaczynała się od poniedziałku)
export function leadingEmptyDays(year, month) {
  // getDay(): 0=Nd, 1=Pn, ..., 6=So
  const first = new Date(year, month, 1).getDay();
  // Przerabiamy tak, by poniedziałek był początkiem tygodnia
  // Jeśli pierwszym dniem jest niedziela (0), to chcemy 6 pustych boxów,
  // w przeciwnym razie first-1 pustych
  return (first + 6) % 7;
}

// Format pomocniczy do YYYY-MM-DD
export function toISO(year, month, day) {
  const mm = String(month + 1).padStart(2, '0'); // month 0-11 -> 01-12
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

// Czy dwie daty (YYYY-MM-DD) są równe
export function sameISO(a, b) {
  return a === b;
}

// Opis nagłówka miesiąca (np. „Sierpień 2025”)
export function monthLabel(year, month) {
  const formatter = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' });
  return formatter.format(new Date(year, month, 1));
}