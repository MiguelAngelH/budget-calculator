import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import db from "../services/firebase";

const AdminParameter = () => {
  const { id } = useParams(); // Obtener el ID del parámetro desde la URL
  const [parameterName, setParameterName] = useState("");
  const [parameterValue, setParameterValue] = useState("");
  const [correlatives, setCorrelatives] = useState([]);
  const [showCorrelativeForm, setShowCorrelativeForm] = useState(false);

  useEffect(() => {
    const fetchParameter = async () => {
      if (id) {
        // Cargar datos del parámetro
        const parameterRef = doc(db, "MainServer", "Datos", "Parametros", id);
        const parameterSnapshot = await getDoc(parameterRef);
        if (parameterSnapshot.exists()) {
          setParameterName(parameterSnapshot.id);
          setParameterValue(parameterSnapshot.data().Valor);

          // Cargar correlativos
          const correlativesRef = collection(parameterRef, "Correlativos");
          const correlativesSnapshot = await getDocs(correlativesRef);
          const correlativesList = await Promise.all(
            correlativesSnapshot.docs.map(async (correlativeDoc) => {
              const optionsRef = collection(correlativeDoc.ref, "Opciones");
              const optionsSnapshot = await getDocs(optionsRef);
              const optionsList = optionsSnapshot.docs.map((optionDoc) => ({
                id: optionDoc.id,
                name: optionDoc.id,
                value: optionDoc.data().Valor,
              }));
              return {
                id: correlativeDoc.id,
                name: correlativeDoc.id,
                options: optionsList,
              };
            })
          );
          setCorrelatives(correlativesList);
          setShowCorrelativeForm(true); // Mostrar el formulario de correlativos al editar
        }
      }
    };

    fetchParameter();
  }, [id]);

  const handleAddCorrelative = () => {
    setCorrelatives([
      ...correlatives,
      { id: null, name: "", options: [{ name: "", value: "" }] },
    ]);
  };

  const handleAddOption = (correlativeIndex) => {
    const updatedCorrelatives = [...correlatives];
    updatedCorrelatives[correlativeIndex].options.push({ name: "", value: "" });
    setCorrelatives(updatedCorrelatives);
  };

  const handleDeleteOption = async (correlativeIndex, optionIndex) => {
    try {
      const updatedCorrelatives = [...correlatives];
      const optionToDelete = updatedCorrelatives[correlativeIndex].options[optionIndex];
  
      // Si la opción tiene un nombre (ya existe en la base de datos), eliminarla de Firestore
      if (optionToDelete.name) {
        const correlativeName = updatedCorrelatives[correlativeIndex].name;
        const parameterRef = doc(db, "MainServer", "Datos", "Parametros", parameterName);
        const optionRef = doc(
          collection(parameterRef, "Correlativos", correlativeName, "Opciones"),
          optionToDelete.name
        );
        await deleteDoc(optionRef);
      }
  
      // Eliminar la opción del estado local
      updatedCorrelatives[correlativeIndex].options.splice(optionIndex, 1);
      setCorrelatives(updatedCorrelatives);
    } catch (error) {
      console.error("Error al eliminar la opción:", error);
      alert("Hubo un error al intentar eliminar la opción.");
    }
  };

  const handleSaveParameter = async () => {
    if (!parameterName || isNaN(parseFloat(parameterValue))) {
      alert("Por favor, ingresa un nombre válido y un valor numérico.");
      return;
    }

    try {
      // Si el nombre del parámetro cambió, eliminar el documento anterior
      if (id && id !== parameterName) {
        const oldParameterRef = doc(db, "MainServer", "Datos", "Parametros", id);
        await deleteDoc(oldParameterRef);
      }

      // Crear o actualizar el documento del parámetro
      const parameterRef = doc(db, "MainServer", "Datos", "Parametros", parameterName);
      await setDoc(parameterRef, { Valor: parseFloat(parameterValue) });

      // Crear o actualizar la colección "Correlativos" y sus documentos
      for (const correlative of correlatives) {
        if (!correlative.name) continue;

        const correlativeRef = doc(
          collection(parameterRef, "Correlativos"),
          correlative.name
        );

        await setDoc(correlativeRef, {}); // Crear o actualizar el documento del correlativo

        // Crear o actualizar la colección "Opciones" dentro del correlativo
        for (const option of correlative.options) {
          if (!option.name || isNaN(parseFloat(option.value))) continue;

          const optionRef = doc(collection(correlativeRef, "Opciones"), option.name);
          await setDoc(optionRef, { Valor: parseFloat(option.value) });
        }
      }

      alert("Parámetro guardado correctamente.");
      setParameterName("");
      setParameterValue("");
      setCorrelatives([]);
      setShowCorrelativeForm(false);
    } catch (error) {
      console.error("Error al guardar el parámetro:", error);
      alert("Hubo un error al guardar el parámetro.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Editar Parámetro" : "Crear Parámetro"}
      </h1>

      {/* Formulario para el parámetro */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nombre del parámetro"
          value={parameterName}
          onChange={(e) => setParameterName(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Valor del parámetro"
          value={parameterValue}
          onChange={(e) => setParameterValue(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={() => setShowCorrelativeForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agregar Correlativos
        </button>
      </div>

      {/* Formulario para los correlativos */}
      {showCorrelativeForm && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Correlativos</h2>
          {correlatives.map((correlative, correlativeIndex) => (
            <div key={correlativeIndex} className="mb-4 border p-4 rounded">
              <input
                type="text"
                placeholder="Nombre del correlativo"
                value={correlative.name}
                onChange={(e) => {
                  const updatedCorrelatives = [...correlatives];
                  updatedCorrelatives[correlativeIndex].name = e.target.value;
                  setCorrelatives(updatedCorrelatives);
                }}
                className="border p-2 rounded w-full mb-2"
              />
              <h3 className="text-lg font-semibold mb-2">Opciones</h3>
              {correlative.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Nombre de la opción"
                    value={option.name}
                    onChange={(e) => {
                      const updatedCorrelatives = [...correlatives];
                      updatedCorrelatives[correlativeIndex].options[optionIndex].name =
                        e.target.value;
                      setCorrelatives(updatedCorrelatives);
                    }}
                    className="border p-2 rounded flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Valor de la opción"
                    value={option.value}
                    onChange={(e) => {
                      const updatedCorrelatives = [...correlatives];
                      updatedCorrelatives[correlativeIndex].options[optionIndex].value =
                        e.target.value;
                      setCorrelatives(updatedCorrelatives);
                    }}
                    className="border p-2 rounded flex-1"
                  />
                  <button
                    onClick={() => handleDeleteOption(correlativeIndex, optionIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddOption(correlativeIndex)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Más
              </button>
            </div>
          ))}
          <button
            onClick={handleAddCorrelative}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Correlativo
          </button>
        </div>
      )}

      {/* Botón para guardar */}
      <button
        onClick={handleSaveParameter}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Guardar Parámetro
      </button>
    </div>
  );
};

export default AdminParameter;