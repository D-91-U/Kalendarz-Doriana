// Helper do czytania i zapisu w localStorage z bezpiecznym JSON.parse

// getItem: czyta klucz z localStorage i zwraca sparsowany obiekt albo domyślną wartość
export function getItem(key, defaultValue = null) {
  // Pobieramy surowy tekst spod klucza
  const raw = localStorage.getItem(key);
  // Jeśli nic nie ma, zwróć domyślną wartość
  if (raw === null) return defaultValue;
  try {
    // Próbujemy sparsować JSON
    return JSON.parse(raw);
  } catch {
    // Gdyby był błąd (np. ktoś ręcznie popsuł dane), zwracamy domyślne
    return defaultValue;
  }
}

// setItem: zapisuje dowolną wartość jako JSON pod kluczem
export function setItem(key, value) {
  // Zamieniamy wartość na tekst JSON i zapisujemy
  localStorage.setItem(key, JSON.stringify(value));
}