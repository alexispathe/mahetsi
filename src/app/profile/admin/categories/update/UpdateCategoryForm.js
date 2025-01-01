// src/app/profile/admin/categories/update/UpdateCategoryForm.js
"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const UpdateCategoryForm = ({ url, onSuccess }) => {
  const { currentUser } = useContext(AuthContext);

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const response = await fetch(`/api/categories/private/get/category/${url}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al cargar la categoría.");

        const data = await response.json();
        setCategoryData({
          name: data.name,
          description: data.description || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCategory(false);
      }
    };

    if (url) loadCategoryData();
  }, [url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!categoryData.name.trim()) {
      setError("Por favor, ingresa un nombre válido para la categoría.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/categories/private/update/${url}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar la categoría.");
      }

      toast.success("Categoría actualizada correctamente.", { theme: "light" });
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCategory) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4 font-bold">Actualizar Categoría</h2>
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
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Descripción (opcional)</label>
          <textarea
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Categoría"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCategoryForm;
