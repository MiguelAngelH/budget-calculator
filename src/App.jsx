import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPage from "./pages/AdminPage";  // Importar AdminPage
import UserPage from "./pages/UserPage"; // Importar UserPage
import AdminParameter from "./pages/AdminParameter"; // Importar AdminParameter
import Login from "./pages/Login"; // Importar Login

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
                  <Link to="/login">
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
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-parameter" element={<AdminParameter />} />
          <Route path="/admin-parameter/:id" element={<AdminParameter />} />
          {/* Ruta del usuario */}
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;