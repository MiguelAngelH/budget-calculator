import React, { useState } from "react";

const AdminPage = () => {
  const [parameters, setParameters] = useState([]);
  const [newParameter, setNewParameter] = useState({ name: "", value: "" });
  const [editingParameterIndex, setEditingParameterIndex] = useState(null); // Índice del parámetro en edición
  const [editingParameter, setEditingParameter] = useState({ name: "", value: "" });
  const [newCorrelative, setNewCorrelative] = useState({ name: "", options: [] });
  const [editingIndex, setEditingIndex] = useState(null); // Índice del parámetro en edición para correlativos
  const [editingCorrelativeIndex, setEditingCorrelativeIndex] = useState(null); // Índice del correlativo en edición
  const [newOption, setNewOption] = useState({ name: "", value: "" });

  const handleAddParameter = () => {
    if (newParameter.name && !isNaN(parseFloat(newParameter.value))) {
      setParameters([...parameters, { ...newParameter, value: parseFloat(newParameter.value), correlatives: [] }]);
      setNewParameter({ name: "", value: "" });
    } else {
      alert("El valor del parámetro debe ser un número válido.");
    }
  };

  const handleEditParameter = (index) => {
    setEditingParameterIndex(index);
    setEditingParameter({ ...parameters[index] });
  };

  const handleSaveEditedParameter = () => {
    if (editingParameter.name && !isNaN(parseFloat(editingParameter.value))) {
      const updatedParameters = [...parameters];
      updatedParameters[editingParameterIndex] = {
        ...editingParameter,
        value: parseFloat(editingParameter.value),
      };
      setParameters(updatedParameters);
      setEditingParameterIndex(null);
      setEditingParameter({ name: "", value: "" });
    } else {
      alert("El valor del parámetro debe ser un número válido.");
    }
  };

  const handleAddCorrelative = () => {
    if (newCorrelative.name) {
      const updatedParameters = [...parameters];
      updatedParameters[editingIndex].correlatives.push({ ...newCorrelative });
      setParameters(updatedParameters);
      setNewCorrelative({ name: "", options: [] });
      setEditingIndex(null); // Cerrar el cuadro de edición
    } else {
      alert("El nombre del correlativo no puede estar vacío.");
    }
  };

  const handleAddOption = () => {
    if (newOption.name && !isNaN(parseFloat(newOption.value))) {
      setNewCorrelative({
        ...newCorrelative,
        options: [...newCorrelative.options, { ...newOption, value: parseFloat(newOption.value) }],
      });
      setNewOption({ name: "", value: "" });
    } else {
      alert("El nombre y el valor de la opción deben ser válidos.");
    }
  };

  const handleDeleteOption = (paramIndex, corrIndex, optionIndex) => {
    const updatedParameters = [...parameters];
    updatedParameters[paramIndex].correlatives[corrIndex].options = updatedParameters[paramIndex].correlatives[
      corrIndex
    ].options.filter((_, i) => i !== optionIndex);
    setParameters(updatedParameters);
  };

  const handleDeleteCorrelative = (paramIndex, corrIndex) => {
    const updatedParameters = [...parameters];
    updatedParameters[paramIndex].correlatives = updatedParameters[paramIndex].correlatives.filter(
      (_, i) => i !== corrIndex
    );
    setParameters(updatedParameters);
  };

  const handleEditCorrelative = (paramIndex, corrIndex) => {
    setEditingIndex(paramIndex);
    setEditingCorrelativeIndex(corrIndex);
    const correlativeToEdit = parameters[paramIndex].correlatives[corrIndex];
    setNewCorrelative({ ...correlativeToEdit });
  };

  const handleSaveEditedCorrelative = () => {
    const updatedParameters = [...parameters];
    updatedParameters[editingIndex].correlatives[editingCorrelativeIndex] = { ...newCorrelative };
    setParameters(updatedParameters);
    setNewCorrelative({ name: "", options: [] });
    setEditingIndex(null);
    setEditingCorrelativeIndex(null);
  };

  const handleDeleteParameter = (index) => {
    const updatedParameters = parameters.filter((_, i) => i !== index);
    setParameters(updatedParameters);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel del Administrador</h1>

      {/* Formulario para agregar parámetros */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Agregar Parámetro</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Nombre del parámetro"
            value={newParameter.name}
            onChange={(e) => setNewParameter({ ...newParameter, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            step="any"
            placeholder="Valor numérico"
            value={newParameter.value}
            onChange={(e) => setNewParameter({ ...newParameter, value: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddParameter}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Agregar Parámetro
          </button>
        </div>
      </div>

      {/* Lista de parámetros */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Parámetros Existentes</h2>
        <ul className="list-disc pl-5">
          {parameters.map((param, paramIndex) => (
            <li key={paramIndex} className="mb-4">
              {editingParameterIndex === paramIndex ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Nombre del parámetro"
                    value={editingParameter.name}
                    onChange={(e) => setEditingParameter({ ...editingParameter, name: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Valor numérico"
                    value={editingParameter.value}
                    onChange={(e) => setEditingParameter({ ...editingParameter, value: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <button
                    onClick={handleSaveEditedParameter}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Guardar Cambios
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>
                    {param.name} - {param.value}
                  </span>
                  <button
                    onClick={() => handleEditParameter(paramIndex)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
          Editar
        </button>
        <button
          onClick={() => {
            setNewCorrelative({ name: "", options: [] });
            setEditingIndex(paramIndex); // Establecer el índice del parámetro en edición para correlativos
          }}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          Agregar Correlativo
        </button>
        <button
          onClick={() => handleDeleteParameter(paramIndex)}
          className="text-red-500 hover:text-red-700"
        >
          🗑️
        </button>
                </div>
              )}

              {/* Mostrar correlativos existentes */}
              <ul className="pl-5 mt-2">
                {param.correlatives.map((corr, corrIndex) => (
                  <li key={corrIndex} className="mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{corr.name}</span>
                      <button
                        onClick={() => handleEditCorrelative(paramIndex, corrIndex)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCorrelative(paramIndex, corrIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                    <ul className="pl-5">
                      {corr.options.map((option, optionIndex) => (
                        <li key={optionIndex} className="flex items-center gap-2">
                          <span>
                            {option.name} - {option.value}
                          </span>
                          <button
                            onClick={() => handleDeleteOption(paramIndex, corrIndex, optionIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              {/* Formulario para agregar o editar correlativo */}
              {editingIndex === paramIndex && editingCorrelativeIndex === null && (
                <div className="mt-4 p-4 border rounded bg-gray-800 text-white">
                  <h3 className="text-lg font-semibold mb-2">Agregar Correlativo</h3>
                  <input
                    type="text"
                    placeholder="Nombre del correlativo"
                    value={newCorrelative.name}
                    onChange={(e) => setNewCorrelative({ ...newCorrelative, name: e.target.value })}
                    className="border p-2 rounded w-full mb-2 bg-gray-700 text-white"
                  />
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nombre de la opción"
                      value={newOption.name}
                      onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                      className="border p-2 rounded flex-1 bg-gray-700 text-white"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Valor numérico"
                      value={newOption.value}
                      onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                      className="border p-2 rounded flex-1 bg-gray-700 text-white"
                    />
                    <button
                      onClick={handleAddOption}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                    Agregar Opción
                  </button>
                </div>
                <ul className="list-disc pl-5">
                  {newCorrelative.options.map((option, optionIndex) => (
                    <li key={optionIndex} className="flex items-center gap-2">
                      <span>
                        {option.name} - {option.value}
                      </span>
                      <button
                        onClick={() => {
                          const updatedOptions = newCorrelative.options.filter((_, i) => i !== optionIndex);
                          setNewCorrelative({ ...newCorrelative, options: updatedOptions });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleAddCorrelative}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                  >
                    Guardar Correlativo
                  </button>
                </div>
              )}

              {/* Formulario para editar correlativo */}
              {editingIndex === paramIndex && editingCorrelativeIndex !== null && (
                <div className="mt-4 p-4 border rounded bg-gray-800 text-white">
                  <h3 className="text-lg font-semibold mb-2">Editar Correlativo</h3>
                  <input
                    type="text"
                    placeholder="Nombre del correlativo"
                    value={newCorrelative.name}
                    onChange={(e) => setNewCorrelative({ ...newCorrelative, name: e.target.value })}
                    className="border p-2 rounded w-full mb-2 bg-gray-700 text-white"
                  />
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nombre de la opción"
                      value={newOption.name}
                      onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                      className="border p-2 rounded flex-1 bg-gray-700 text-white"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Valor numérico"
                      value={newOption.value}
                      onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                      className="border p-2 rounded flex-1 bg-gray-700 text-white"
                    />
                    <button
                      onClick={handleAddOption}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Agregar Opción
                    </button>
                  </div>
                  <ul className="list-disc pl-5">
                    {newCorrelative.options.map((option, optionIndex) => (
                      <li key={optionIndex} className="flex items-center gap-2">
                        <span>
                          {option.name} - {option.value}
                        </span>
                        <button
                          onClick={() => handleDeleteOption(optionIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleSaveEditedCorrelative}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;