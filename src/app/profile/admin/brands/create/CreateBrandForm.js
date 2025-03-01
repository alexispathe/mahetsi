// src/app/profile/admin/brands/create/CreateBrandForm.js
"use client";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const CreateBrandForm = ({ categories, onSuccess }) => {
  const { currentUser } = useContext(AuthContext);
  const [brandData, setBrandData] = useState({
    name: "",
    description: "",
    categoryID: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!brandData.name.trim()) {
      setError("Por favor, ingresa un nombre válido para la marca.");
      return;
    }
    if (!brandData.categoryID) {
      setError("Por favor, selecciona una categoría.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/brands/private/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la marca.");
      }

      toast.success("Marca creada correctamente.", { theme: "light" });
      // Notificamos al padre para que refetchee y/o cierre panel
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4 font-bold">Crear Marca</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Nombre de la Marca */}
        <div className="mb-4">
          <label className="block mb-1">Nombre de la Marca</label>
          <input
            type="text"
            name="name"
            value={brandData.name}
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
            value={brandData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción de la marca (opcional)"
          />
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block mb-1">Categoría</label>
          <select
            name="categoryID"
            value={brandData.categoryID}
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
          {isSubmitting ? "Creando..." : "Crear Marca"}
        </button>
      </form>
    </div>
  );
};

export default CreateBrandForm;
