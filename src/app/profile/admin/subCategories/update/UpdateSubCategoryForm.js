// src/app/profile/admin/categories/subCategories/update/UpdateSubCategoryForm.js
"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const UpdateSubCategoryForm = ({
  categoryUrl,
  subCategoryUrl,
  categories,
  onSuccess,
}) => {
  const { currentUser } = useContext(AuthContext);

  const [subcategoryData, setSubcategoryData] = useState({
    name: "",
    description: "",
    categoryID: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSubCategory, setLoadingSubCategory] = useState(true);

  useEffect(() => {
    const loadSubcategoryData = async () => {
      try {
        const response = await fetch(
          `/api/categories/private/subCategories/get/${categoryUrl}/${subCategoryUrl}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al cargar la subcategoría."
          );
        }
        const data = await response.json();
        setSubcategoryData({
          name: data.name || "",
          description: data.description || "",
          categoryID: data.categoryID || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingSubCategory(false);
      }
    };

    if (categoryUrl && subCategoryUrl) {
      loadSubcategoryData();
    }
  }, [categoryUrl, subCategoryUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!subcategoryData.name.trim()) {
      setError("Por favor, ingresa un nombre válido para la subcategoría.");
      return;
    }
    if (!subcategoryData.categoryID) {
      setError("Por favor, selecciona una categoría.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/categories/private/subCategories/update/${categoryUrl}/${subCategoryUrl}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subcategoryData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al actualizar la subcategoría."
        );
      }

      toast.success("Subcategoría actualizada correctamente.", {
        theme: "light",
      });
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSubCategory) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4 font-bold">Actualizar Subcategoría</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="mb-4">
          <label className="block mb-1">Nombre de la Subcategoría</label>
          <input
            type="text"
            name="name"
            value={subcategoryData.name}
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
            value={subcategoryData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción de la subcategoría (opcional)"
          />
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block mb-1">Categoría</label>
          <select
            name="categoryID"
            value={subcategoryData.categoryID}
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
          {isSubmitting ? "Cargando..." : "Actualizar Subcategoría"}
        </button>
      </form>
    </div>
  );
};

export default UpdateSubCategoryForm;
