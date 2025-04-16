import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <Routes>
          {/* Página principal */}
          <Route
            path="/"
            element={
              <div className="text-center text-white">
                <h1 className="text-3xl font-bold mb-6">Calculadora de Presupuestos</h1>
                <div className="flex gap-4 justify-center">
                  <Link to="/admin">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Ir al Administrador
                    </button>
                  </Link>
                  <Link to="/user">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Ir al Usuario
                    </button>
                  </Link>
                </div>
              </div>
            }
          />
          {/* Ruta del administrador */}
          <Route path="/admin" element={<AdminPage />} />
          {/* Ruta del usuario (pendiente de crear) */}
          <Route
            path="/user"
            element={
              <div className="text-center text-white">
                <h1 className="text-2xl font-bold">Vista del Usuario</h1>
                <p>Esta página está en construcción.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;