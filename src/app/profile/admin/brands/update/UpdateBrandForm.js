// src/app/profile/admin/brands/update/UpdateBrandForm.js
"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const UpdateBrandForm = ({ url, categories, onSuccess }) => {
  const { currentUser } = useContext(AuthContext);

  const [brandData, setBrandData] = useState({
    name: "",
    description: "",
    categoryID: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingBrand, setLoadingBrand] = useState(true);

  useEffect(() => {
    const loadBrandData = async () => {
      try {
        const response = await fetch(`/api/brands/private/get/brand/${url}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar la marca.");
        }

        const data = await response.json();
        setBrandData({
          name: data.name || "",
          description: data.description || "",
          categoryID: data.categoryID || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingBrand(false);
      }
    };

    if (url) loadBrandData();
  }, [url]);

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
      const response = await fetch(`/api/brands/private/update/${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar la marca.");
      }

      toast.success("Marca actualizada correctamente.", { theme: "light" });
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingBrand) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4 font-bold">Actualizar Marca</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
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
          {isSubmitting ? "Actualizando..." : "Actualizar Marca"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBrandForm;
