import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import emailjs from "emailjs-com"; // Importar EmailJS
import db from "../services/firebase";

const UserPage = () => {
  const [parameters, setParameters] = useState([]); // Almacenar parámetros con correlativos
  const [values, setValues] = useState({}); // Almacenar los valores ingresados por el usuario
  const [selectedOptions, setSelectedOptions] = useState({}); // Almacenar las opciones seleccionadas
  const [email, setEmail] = useState(""); // Almacenar el correo ingresado por el usuario
  const [adminEmail, setAdminEmail] = useState(""); // Almacenar el correo del administrador

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const paramsRef = collection(db, "MainServer", "Datos", "Parametros");
        const paramsSnapshot = await getDocs(paramsRef);

        const params = [];
        for (const paramDoc of paramsSnapshot.docs) {
          const paramData = { id: paramDoc.id, ...paramDoc.data() };

          // Obtener correlativos para cada parámetro
          const correlativesRef = collection(paramDoc.ref, "Correlativos");
          const correlativesSnapshot = await getDocs(correlativesRef);

          const correlatives = [];
          for (const correlativeDoc of correlativesSnapshot.docs) {
            const correlativeData = { id: correlativeDoc.id };

            // Obtener opciones para cada correlativo
            const optionsRef = collection(correlativeDoc.ref, "Opciones");
            const optionsSnapshot = await getDocs(optionsRef);

            const options = optionsSnapshot.docs.map((optionDoc) => ({
              id: optionDoc.id,
              value: optionDoc.data().Valor,
            }));

            correlativeData.options = options;
            correlatives.push(correlativeData);
          }

          paramData.correlatives = correlatives;
          params.push(paramData);
        }

        setParameters(params); // Actualizar el estado con los parámetros y sus correlativos
      } catch (error) {
        console.error("Error al obtener los parámetros:", error);
      }
    };

    const fetchAdminEmail = async () => {
      try {
        const adminDocRef = doc(db, "MainServer", "Datos");
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists()) {
          setAdminEmail(adminDoc.data().correo); // Obtener el correo del administrador
        }
      } catch (error) {
        console.error("Error al obtener el correo del administrador:", error);
      }
    };

    fetchParameters();
    fetchAdminEmail();
  }, []);

  // Manejar el cambio en el valor ingresado por el usuario
  const handleValueChange = (paramId, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [paramId]: value,
    }));
  };

  // Manejar el cambio en la opción seleccionada
  const handleOptionChange = (paramId, correlativeId, value) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [paramId]: {
        ...prevSelectedOptions[paramId],
        [correlativeId]: value,
      },
    }));
  };

  // Calcular el total
  const calculateTotal = () => {
    return parameters.reduce((total, param) => {
      const paramValue = parseFloat(param.Valor) || 0;
      const userValue = parseFloat(values[param.id]) || 0;

      const correlativesTotal = param.correlatives?.reduce((correlativeSum, correlative) => {
        const selectedOptionValue =
          parseFloat(selectedOptions[param.id]?.[correlative.id]) || 1;
        return correlativeSum * selectedOptionValue;
      }, 1);

      return total + paramValue * userValue * (correlativesTotal || 1);
    }, 0);
  };

  // Enviar correos
  const handleSendEmail = () => {
    // Generar el detalle del presupuesto
    const budgetDetails = parameters.map((param) => {
      const userValue = parseFloat(values[param.id]) || 0;
      const paramValue = parseFloat(param.Valor) || 0;
  
      // Calcular el total del parámetro
      const correlativesDetails = param.correlatives
        ?.map((correlative) => {
          const selectedOptionValue = parseFloat(selectedOptions[param.id]?.[correlative.id]) || 1;
          const selectedOptionId = correlative.options.find(
            (option) => parseFloat(option.value) === selectedOptionValue
          )?.id;
  
          return `${correlative.id} (${selectedOptionId || "Sin opción"})`;
        })
        .join("\n");
  
      const correlativesTotal = param.correlatives?.reduce((correlativeSum, correlative) => {
        const selectedOptionValue =
          parseFloat(selectedOptions[param.id]?.[correlative.id]) || 1;
        return correlativeSum * selectedOptionValue;
      }, 1);
  
      const paramTotal = paramValue * userValue * (correlativesTotal || 1);
  
      return `${param.id}: ${userValue}\n${correlativesDetails}\n.......... Total: ${paramTotal.toFixed(
        2
      )}`;
    });
  
    const total = calculateTotal().toFixed(2);
  
    const emailMessage = `
  Presupuesto:
  
  ${budgetDetails.join("\n\n")}
  
  Total.................... ${total}
    `;
  
    // Datos para el correo al administrador
    const adminEmailData = {
      to_email: adminEmail,
      message: emailMessage,
    };
  
    // Datos para el correo al usuario
    const userEmailData = {
      to_email: email,
      message: emailMessage,
    };
  
    emailjs.init("x0-vxAmaDFJoDqpBJ"); // Reemplaza con tu Public Key
  
    // Enviar correo al administrador
    emailjs
      .send(
        "service_gv1sh0d", // Reemplaza con tu Service ID
        "template_0sska2b", // Reemplaza con tu Template ID
        adminEmailData
      )
      .then(
        (response) => {
          console.log("Correo enviado al administrador:", response.status, response.text);
        },
        (error) => {
          console.error("Error al enviar el correo al administrador:", error);
        }
      );
  
    // Enviar correo al usuario
    emailjs
      .send(
        "service_gv1sh0d", // Reemplaza con tu Service ID
        "template_0sska2b", // Reemplaza con tu Template ID
        userEmailData
      )
      .then(
        (response) => {
          console.log("Correo enviado al usuario:", response.status, response.text);
        },
        (error) => {
          console.error("Error al enviar el correo al usuario:", error);
        }
      );
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vista del Usuario</h1>
      <ul className="list-disc pl-5">
        {parameters.map((param) => (
          <li key={param.id} className="mb-6">
            {/* Mostrar el parámetro */}
            <div className="mb-2">
              <span className="font-semibold">{param.id}</span>
              <input
                type="number"
                placeholder="Ingrese un número"
                className="border p-2 rounded bg-white text-black ml-4"
                onChange={(e) => handleValueChange(param.id, e.target.value)}
              />
            </div>

            {/* Mostrar correlativos */}
            {param.correlatives && (
              <ul className="pl-5">
                {param.correlatives.map((correlative) => (
                  <li key={correlative.id} className="mb-2">
                    <div className="flex items-center gap-4">
                      <span>{correlative.id}</span>
                      <select
                        className="border p-2 rounded bg-white text-black"
                        onChange={(e) =>
                          handleOptionChange(param.id, correlative.id, e.target.value)
                        }
                      >
                        <option value="1">Seleccione una opción</option>
                        {correlative.options.map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.id}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Mostrar el total */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Total = {calculateTotal().toFixed(2)}</h2>
      </div>

      {/* Cuadro para ingresar el correo */}
      <div className="mt-6">
        <label htmlFor="email" className="block text-lg font-semibold mb-2">
          Ingrese su correo:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          className="border p-2 rounded w-full bg-white text-black"
        />
      </div>

      {/* Botón para generar presupuesto */}
      <div className="mt-6">
        <button
          onClick={handleSendEmail}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Generar Presupuesto
        </button>
      </div>
    </div>
  );
};

export default UserPage;