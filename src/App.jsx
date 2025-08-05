import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
// Importujemy nowy widok i bramkę
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
// Dodatkowo możemy pokazać link do Dashboard tylko gdy jest zalogowany
import { getSession } from './utils/userService';

function App() {
  // Pobierz sesję (proste sprawdzenie czy zalogowany)
  const session = getSession();

  return (
    <div>
      <nav style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        {/* Link do dashboardu widoczny dla zalogowanych */}
        {session?.email && <Link to="/dashboard" style={{ marginRight: 12 }}>Panel</Link>}
        {/* Jeśli zalogowany — nie pokazuj login/register */}
        {!session?.email ? (
          <>
            <Link to="/login" style={{ marginRight: 12 }}>Logowanie</Link>
            <Link to="/register">Rejestracja</Link>
          </>
        ) : null}
      </nav>

      <main style={{ padding: '16px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Chroniona trasa — tylko dla zalogowanych */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;