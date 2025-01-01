// src/app/profile/admin/dashboard/page.js
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import useGetData from "@/hooks/useGetData";  // <--- Aquí importas tu hook renombrado
import CollapsibleSection from "./components/CollapsibleSection";
import Header from "@/app/components/Header";

// Importa tus formularios
import CreateCategoryForm from "@/app/profile/admin/categories/create/CreateCategoryForm";
import UpdateCategoryForm from "@/app/profile/admin/categories/update/UpdateCategoryForm";

const AdminDashboard = () => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [action, setAction] = useState(null); // 'create' | 'update' | null
  const [activeSection, setActiveSection] = useState(null); // 'category', 'subCategory', etc.
  const [selectedUrl, setSelectedUrl] = useState("");

  // Verifica permisos
  useEffect(() => {
    if (
      !authLoading &&
      (!currentUser ||
        !currentUser.permissions?.includes("create") ||
        !currentUser.permissions?.includes("update"))
    ) {
      router.push("/login");
    }
  }, [authLoading, currentUser, router]);

  // Solo hacemos fetch si tiene permisos
  const shouldFetch =
    currentUser?.permissions?.includes("create") &&
    currentUser?.permissions?.includes("update");

  // Hook para traer categorías (cambia el nombre)
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories, // <-- Destructuramos la función para volver a pedir la data
  } = useGetData(
    shouldFetch ? "/api/categories/private/get/list" : null,
    "categories",
    shouldFetch
  );
  
  // Aquí podrías hacer lo mismo para subcategories, brands, etc. con más hooks
  // const { data: subcategories, ... } = useGetData(...);

  const loading = authLoading || categoriesLoading;
  const error = categoriesError;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Handlers del panel izquierdo
  const handleCreateCategory = () => {
    setActiveSection("category");
    setAction("create");
    setSelectedUrl("");
  };

  const handleUpdateCategory = (url) => {
    setActiveSection("category");
    setAction("update");
    setSelectedUrl(url);
  };

  // Limpia el panel derecho
  const resetPanel = () => {
    setAction(null);
    setActiveSection(null);
    setSelectedUrl("");
  };

  return (
    <>
      <Header textColor="black" position="relative" />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Panel de Administración</h1>
        <div className="flex">
          {/* Left Panel: 40% */}
          <div className="w-2/5 pr-4 space-y-6">
            <CollapsibleSection
              title="Categorías"
              color="bg-blue-500 hover:bg-blue-600"
              items={categories.categories}
              onCreate={handleCreateCategory}
              onUpdate={handleUpdateCategory}
            />
            {/* Podrías poner aquí otras CollapsibleSections para Subcategorías, Marcas, etc. */}
          </div>

          {/* Right Panel: 60% */}
          <div className="w-3/5 bg-gray-50 p-4 rounded">
            {action === "create" && activeSection === "category" && (
              <CreateCategoryForm
                onSuccess={() => {
                  resetPanel();
                  refetchCategories(); // <-- Volvemos a traer la lista, se actualiza el panel
                }}
              />
            )}

            {action === "update" && activeSection === "category" && selectedUrl && (
              <UpdateCategoryForm
                url={selectedUrl}
                onSuccess={() => {
                  resetPanel();
                  refetchCategories(); // <-- Volvemos a traer la lista
                }}
              />
            )}

            {/* Acá podrías hacer lo mismo para subcategorías, etc. */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
