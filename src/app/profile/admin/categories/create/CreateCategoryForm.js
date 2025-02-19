// src/app/profile/admin/categories/create/CreateCategoryForm.js
"use client";
import { useState } from "react";
import { toast } from "react-toastify";

const CreateCategoryForm = ({ onSuccess }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!categoryData.name.trim()) {
      setError("Por favor, ingresa un nombre válido para la categoría.");
      return;
    }

    if (categoryData.image && !isValidUrl(categoryData.image)) {
      setError("Por favor, ingresa una URL válida para la imagen.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/categories/private/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la categoría.");
      }

      toast.success("Categoría creada correctamente.", { theme: "light" });
      onSuccess?.();
      setCategoryData({
        name: "",
        description: "",
        image: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4 font-bold">Crear Categoría</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre de la Categoría</label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Descripción (opcional)</label>
          <textarea
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción de la categoría (opcional)"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">URL de la Imagen (opcional)</label>
          <input
            type="url"
            name="image"
            value={categoryData.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Creando..." : "Crear Categoría"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryForm;
