import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// NOWE:
import Calendar from './pages/Calendar';

// (opcjonalnie) jeśli masz:
import ProtectedRoute from './components/ProtectedRoute';
import { getSession } from './utils/userService';

export default function App() {
  const session = getSession();

  return (
    <div>
      <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        {session?.email && <Link to="/calendar" style={{ marginRight: 12 }}>Kalendarz</Link>}
        {!session?.email && (
          <>
            <Link to="/login" style={{ marginRight: 12 }}>Logowanie</Link>
            <Link to="/register">Rejestracja</Link>
          </>
        )}
      </nav>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Wariant A: z ProtectedRoute */}
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />

          {/* Wariant B (jeśli nie masz ProtectedRoute, użyj po prostu): */}
          {/* <Route path="/calendar" element={<Calendar />} /> */}
        </Routes>
      </main>
    </div>
  );
}