// src/app/profile/admin/types/create/CreateTypeForm.js
"use client";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const CreateTypeForm = ({ categories = [], onSuccess }) => {
  const { currentUser } = useContext(AuthContext);

  const [typeData, setTypeData] = useState({
    name: "",
    description: "",
    categoryID: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTypeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!typeData.name.trim()) {
      setError("Por favor, ingresa un nombre válido para el tipo.");
      return;
    }
    if (!typeData.categoryID) {
      setError("Por favor, selecciona una categoría.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/types/private/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(typeData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el tipo.");
      }

      toast.success("Tipo creado correctamente.", { theme: "light" });
      // Llamamos a onSuccess para que el Dashboard haga refetch de la lista
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4 font-bold">Crear Nuevo Tipo</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="mb-4">
          <label className="block mb-1">Nombre del Tipo</label>
          <input
            type="text"
            name="name"
            value={typeData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label className="block mb-1">Descripción (opcional)</label>
          <textarea
            name="description"
            value={typeData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción del tipo (opcional)"
          />
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block mb-1">Categoría</label>
          <select
            name="categoryID"
            value={typeData.categoryID}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.uniqueID} value={cat.uniqueID}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Creando..." : "Crear Tipo"}
        </button>
      </form>
    </div>
  );
};

export default CreateTypeForm;
