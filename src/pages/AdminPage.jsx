import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../services/firebase";

const AdminPage = () => {
  const [parameters, setParameters] = useState([]); // Estado para almacenar los parámetros
  const [email, setEmail] = useState(""); // Estado para almacenar el correo
  const [isEditingEmail, setIsEditingEmail] = useState(false); // Estado para controlar si se está editando el correo
  const [newEmail, setNewEmail] = useState(""); // Estado para el nuevo correo
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login"); // Redirigir al login si no está autenticado
      return;
    }

    // Obtener parámetros desde Firestore
    const unsubscribe = onSnapshot(
      collection(db, "MainServer", "Datos", "Parametros"),
      (snapshot) => {
        const params = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setParameters(params); // Actualizar el estado con los parámetros
      }
    );

    // Obtener el correo desde Firestore
    const fetchEmail = async () => {
      try {
        const docRef = doc(db, "MainServer", "Datos");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmail(docSnap.data().correo); // Actualizar el estado con el correo
        } else {
          console.error("No se encontró el documento.");
        }
      } catch (error) {
        console.error("Error al obtener el correo:", error);
      }
    };

    fetchEmail();

    return () => unsubscribe(); // Limpiar la suscripción
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Eliminar el estado de autenticación
    navigate("/login"); // Redirigir al login
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel del Administrador</h1>

      {/* Mostrar el correo */}
      <div className="mb-6 p-4 bg-gray-100 rounded shadow flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Correo Registrado</h2>
          {isEditingEmail ? (
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border p-2 rounded w-full text-gray-700"
              placeholder="Nuevo correo"
            />
          ) : (
            <p className="text-gray-700">{email || "No se encontró un correo registrado."}</p>
          )}
        </div>
        <div>
          {isEditingEmail ? (
            <button
              onClick={() => {
                setEmail(newEmail);
                setIsEditingEmail(false);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Guardar
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditingEmail(true);
                setNewEmail(email); // Prellenar el campo con el correo actual
              }}
              className="text-yellow-500 hover:text-yellow-700"
            >
              ✏️
            </button>
          )}
        </div>
      </div>

      {/* Mostrar parámetros existentes */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Parámetros Existentes</h2>
        <ul className="list-disc pl-5">
          {parameters.map((param) => (
            <li key={param.id} className="mb-4">
              <div className="flex items-center gap-4">
                <span>
                  {param.id} - {param.Valor}
                </span>
                <button
                  onClick={() => navigate(`/admin-parameter/${param.id}`)} // Navegar a la página de edición
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  ✏️
                </button>
                <button
                  onClick={() => console.log("Eliminar parámetro")} // Aquí puedes agregar la lógica para eliminar
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/admin-parameter")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ir a AdminParameter
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AdminPage;