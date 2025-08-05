// Importujemy narzędzia routera do definiowania ścieżek
import { Routes, Route, Link } from 'react-router-dom';
// Importujemy nasze strony (stworzymy je za chwilę)
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Prosty layout z menu i trasami
function App() {
  return (
    <div>
      {/* Prosta nawigacja na górze — ułatwia przechodzenie między stronami */}
      <nav style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
        {/* Link to odpowiednik <a>, ale bez przeładowania strony */}
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        <Link to="/login" style={{ marginRight: 12 }}>Logowanie</Link>
        <Link to="/register">Rejestracja</Link>
      </nav>

      {/* Tutaj renderują się strony w zależności od ścieżki */}
      <main style={{ padding: '16px' }}>
        <Routes>
          {/* "/" wyświetla stronę główną */}
          <Route path="/" element={<Home />} />
          {/* "/login" wyświetla stronę logowania */}
          <Route path="/login" element={<Login />} />
          {/* "/register" wyświetla stronę rejestracji */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
