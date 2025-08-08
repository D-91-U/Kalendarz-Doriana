import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { clearSession, getSession } from "./utils/userService";
import { useNavigate } from "react-router-dom";
import Calendar from "./pages/Calendar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const session = getSession();

  const navigate = useNavigate();
  const handleLogout = () => {
    clearSession();
    navigate("/");
  };
  const linkStyle = {
    marginRight: 12,
    backgroundColor: "#0a5e5e",
    color: "white",
    padding: "8px 14px",
    borderRadius: "20px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  };

  const buttonStyle = {
    marginLeft: 12,
    backgroundColor: "red",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "20px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };
  return (
    <div>
      <nav
        style={{
          backgroundColor: "#66b2b2", // morski turkus
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>
          <Link to="/" style={linkStyle}>
            Home
          </Link>

          {session?.email && (
            <>
              <Link to="/calendar" style={linkStyle}>
                Kalendarz
              </Link>
              <button onClick={handleLogout} style={buttonStyle}>
                Wyloguj
              </button>
            </>
          )}

          {!session?.email && (
            <>
              <Link to="/login" style={linkStyle}>
                Logowanie
              </Link>
              <Link to="/register" style={linkStyle}>
                Rejestracja
              </Link>
            </>
          )}
        </div>
      </nav>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calendar" element={<Calendar />} />

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
