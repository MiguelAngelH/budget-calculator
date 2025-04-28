import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../services/firebase";

const UserPage = () => {
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "parameters"), (snapshot) => {
      const params = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setParameters(params);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vista del Usuario</h1>
      <ul className="list-disc pl-5">
        {parameters.map((param) => (
          <li key={param.id} className="mb-4">
            <span>
              {param.name} - {param.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;