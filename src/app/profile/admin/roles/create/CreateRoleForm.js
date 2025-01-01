// src/app/profile/admin/roles/create/CreateRoleForm.js
"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const CreateRoleForm = ({ onSuccess }) => {
  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    permissions: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("El nombre del rol es obligatorio.");
      return;
    }

    // Convierte los permisos en array (separados por comas)
    const permissionsArray = formData.permissions
      ? formData.permissions.split(",").map((p) => p.trim())
      : [];

    const payload = {
      name: formData.name.trim(),
      permissions: permissionsArray,
      description: formData.description.trim(),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/roles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el rol.");
      }

      toast.success("Rol creado exitosamente.", { theme: "light" });
      // Limpia el form o haz lo que necesites
      setFormData({ name: "", permissions: "", description: "" });
      // Avísale al Dashboard para que recargue la lista, etc.
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4 font-bold">Crear Nuevo Rol</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre del Rol</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Permisos (separados por comas)</label>
          <input
            type="text"
            name="permissions"
            value={formData.permissions}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="leer, crear, eliminar"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Descripción (opcional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isSubmitting ? "Creando..." : "Crear Rol"}
        </button>
      </form>
    </div>
  );
};

export default CreateRoleForm;
