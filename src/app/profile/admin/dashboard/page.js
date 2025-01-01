// src/app/profile/admin/dashboard/page.js
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Header from "@/app/components/Header";
import useGetData from "@/hooks/useGetData";
import CollapsibleSection from "./components/CollapsibleSection";

// Category forms (si los tienes)
import CreateCategoryForm from "@/app/profile/admin/categories/create/CreateCategoryForm";
import UpdateCategoryForm from "@/app/profile/admin/categories/update/UpdateCategoryForm";

// Brand forms
import CreateBrandForm from "@/app/profile/admin/brands/create/CreateBrandForm";
import UpdateBrandForm from "@/app/profile/admin/brands/update/UpdateBrandForm";

const AdminDashboard = () => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const router = useRouter();

  // Manejo de acción y sección
  const [action, setAction] = useState(null);          // 'create' | 'update' | null
  const [activeSection, setActiveSection] = useState(null); // 'category' | 'brand' | ...
  const [selectedUrl, setSelectedUrl] = useState("");

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

  // --- 1) Fetch de Categorías ---
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetData(
    shouldFetch ? "/api/categories/private/get/list" : null,
    "categories",
    shouldFetch
  );

  // --- 2) Fetch de Marcas ---
  const {
    data: brands,
    loading: brandsLoading,
    error: brandsError,
    refetch: refetchBrands,
  } = useGetData(
    shouldFetch ? "/api/brands/private/get/list" : null,
    "brands",
    shouldFetch
  );

  const loading = authLoading || categoriesLoading || brandsLoading;
  const error = categoriesError || brandsError;

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

  // Handlers para Categorías (opcional)
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

  // Handlers para Marcas
  const handleCreateBrand = () => {
    setActiveSection("brand");
    setAction("create");
    setSelectedUrl("");
  };
  const handleUpdateBrand = (url) => {
    setActiveSection("brand");
    setAction("update");
    setSelectedUrl(url);
  };

  // Resetea el panel derecho
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
          {/* Panel Izquierdo: 40% */}
          <div className="w-2/5 pr-4 space-y-6">
            {/* Collapsible Sección de Categorías */}
            <CollapsibleSection
              title="Categorías"
              color="bg-blue-500 hover:bg-blue-600"
              items={categories.categories}
              onCreate={handleCreateCategory}
              onUpdate={handleUpdateCategory}
            />

            {/* Collapsible Sección de Marcas */}
            <CollapsibleSection
              title="Marcas"
              color="bg-red-500 hover:bg-red-600"
              items={brands.brands}
              onCreate={handleCreateBrand}
              onUpdate={handleUpdateBrand}
            />
            {/* Podrías poner subcategorías, tipos, productos, etc. de la misma forma */}
          </div>

          {/* Panel Derecho: 60% */}
          <div className="w-3/5 bg-gray-50 p-4 rounded">
            {/* Formularios para Categorías (ejemplo) */}
            {action === "create" && activeSection === "category" && (
              <CreateCategoryForm
                onSuccess={() => {
                  resetPanel();
                  refetchCategories();
                }}
              />
            )}

            {action === "update" && activeSection === "category" && selectedUrl && (
              <UpdateCategoryForm
                url={selectedUrl}
                onSuccess={() => {
                  resetPanel();
                  refetchCategories();
                }}
              />
            )}

            {/* Formularios para Marcas */}
            {action === "create" && activeSection === "brand" && (
              <CreateBrandForm
                // Pasamos las categorías como prop para poblar el <select>
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchBrands(); // Re-cargamos marcas
                }}
              />
            )}

            {action === "update" && activeSection === "brand" && selectedUrl && (
              <UpdateBrandForm
                url={selectedUrl}
                // Pasamos las categorías como prop para poblar el <select>
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchBrands(); // Re-cargamos marcas
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
