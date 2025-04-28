import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../services/firebase";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Consulta a Firestore para verificar las credenciales
      const usersRef = collection(db, "MainServer", "Credenciales", "Usuarios");
      const q = query(usersRef, where("usuario", "==", username), where("clave", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Credenciales válidas
        localStorage.setItem("isAuthenticated", "true"); // Guardar estado de autenticación
        navigate("/admin"); // Redirigir a la sección de administración
      } else {
        // Credenciales inválidas
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Hubo un problema al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="p-4 relative">
      {/* Botón de Volver Atrás */}
      <button
        onClick={() => navigate("/")} // Navegar a la página anterior
        className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 text-2xl"
      >
        ←
      </button>
  
      <div className="mt-12"> {/* Agregamos margen superior para evitar que el botón se superponga */}
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 rounded w-full text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded w-full text-gray-700"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 mb-4"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;