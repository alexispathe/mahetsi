// src/app/profile/admin/dashboard/page.js
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Header from "@/app/components/Header";
import useGetData from "@/hooks/useGetData";
import CollapsibleSection from "./components/CollapsibleSection";

// ========== Formularios Categoría ==========
import CreateCategoryForm from "@/app/profile/admin/categories/create/CreateCategoryForm";
import UpdateCategoryForm from "@/app/profile/admin/categories/update/UpdateCategoryForm";

// ========== Formularios Marca ==========
import CreateBrandForm from "@/app/profile/admin/brands/create/CreateBrandForm";
import UpdateBrandForm from "@/app/profile/admin/brands/update/UpdateBrandForm";

// ========== Formularios SubCategoría ==========
import CreateSubCategoryForm from "@/app/profile/admin/subCategories/create/CreateSubCategoryForm";
import UpdateSubCategoryForm from "@/app/profile/admin/subCategories/update/UpdateSubCategoryForm";

const AdminDashboard = () => {
  // ---- CONTEXT Y ROUTER ----
  const { currentUser, authLoading } = useContext(AuthContext);
  const router = useRouter();

  // ---- ESTADOS PARA EL PANEL DERECHO ----
  // action: "create" o "update"
  const [action, setAction] = useState(null);
  // activeSection: "category", "brand", "subCategory", etc.
  const [activeSection, setActiveSection] = useState(null);

  // Para actualizar, a veces necesitamos una "url" o "uniqueID"
  const [selectedUrl, setSelectedUrl] = useState("");

  // Para subcategorías, podría hacer falta saber `categoryUrl` y `subCategoryUrl`
  const [selectedCategoryUrl, setSelectedCategoryUrl] = useState("");
  const [selectedSubCategoryUrl, setSelectedSubCategoryUrl] = useState("");

  // ---- VERIFICA PERMISOS ----
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

  // ---- FETCH DE CATEGORÍAS ----
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

  // ---- FETCH DE MARCAS ----
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

  // ---- FETCH DE SUBCATEGORÍAS ----
  const {
    data: subcategories,
    loading: subcategoriesLoading,
    error: subcategoriesError,
    refetch: refetchSubCategories,
  } = useGetData(
    shouldFetch ? "/api/categories/private/subCategories/get/list" : null,
    "subcategories",
    shouldFetch
  );

  // ---- ESTADOS DE CARGA/ERROR ----
  const loading = authLoading || categoriesLoading || brandsLoading || subcategoriesLoading;
  const error = categoriesError || brandsError || subcategoriesError;

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

  // ---- HANDLERS PARA CATEGORÍAS ----
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

  // ---- HANDLERS PARA MARCAS ----
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

  // ---- HANDLERS PARA SUBCATEGORÍAS ----
  const handleCreateSubCategory = () => {
    setActiveSection("subCategory");
    setAction("create");
    setSelectedCategoryUrl("");
    setSelectedSubCategoryUrl("");
  };

  // En la lista de subcategorías, cada item debería tener
  // algo como { url, categoryUrl, name, ... }
  // para que podamos armar la actualización
  const handleUpdateSubCategory = (categoryUrl, subCatUrl) => {
    setActiveSection("subCategory");
    setAction("update");
    setSelectedCategoryUrl(categoryUrl);
    setSelectedSubCategoryUrl(subCatUrl);
  };

  // ---- RESETEAR EL PANEL DERECHO ----
  const resetPanel = () => {
    setAction(null);
    setActiveSection(null);
    setSelectedUrl("");
    setSelectedCategoryUrl("");
    setSelectedSubCategoryUrl("");
  };

  return (
    <>
      <Header textColor="black" position="relative" />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Panel de Administración</h1>

        <div className="flex">
          {/* ===================== PANEL IZQUIERDO (40%) ===================== */}
          <div className="w-2/5 pr-4 space-y-6">
            {/* --- SECCIÓN CATEGORÍAS --- */}
            <CollapsibleSection
              title="Categorías"
              color="bg-blue-500 hover:bg-blue-600"
              items={categories.categories}
              // Por defecto, CollapsibleSection usa itemKey="url", itemName="name"
              onCreate={handleCreateCategory}
              onUpdate={(url) => handleUpdateCategory(url)}
            />

            {/* --- SECCIÓN MARCAS --- */}
            <CollapsibleSection
              title="Marcas"
              color="bg-red-500 hover:bg-red-600"
              items={brands.brands}
              onCreate={handleCreateBrand}
              onUpdate={(url) => handleUpdateBrand(url)}
            />

            {/* --- SECCIÓN SUBCATEGORÍAS --- */}
            <CollapsibleSection
              title="Subcategorías"
              color="bg-purple-500 hover:bg-purple-600"
              items={subcategories.subcategories}
              // Las subcategorías deben contener "categoryUrl" y "url"
              // para poder actualizar. Ej: item.categoryUrl, item.url
              onCreate={handleCreateSubCategory}
              onUpdate={(subCatUrl) => {
                // 1) Buscar la subcategoría en el array
                const sc = subcategories.subcategories.find((s) => s.url === subCatUrl);
                // 2) Llamar a la función
                if (sc) {
                  handleUpdateSubCategory(sc.categoryUrl, sc.url);
                }
              }}
            />
          </div>

          {/* ===================== PANEL DERECHO (60%) ===================== */}
          <div className="w-3/5 bg-gray-50 p-4 rounded">
            {/* --- CATEGORÍAS: CREAR --- */}
            {action === "create" && activeSection === "category" && (
              <CreateCategoryForm
                onSuccess={() => {
                  resetPanel();
                  refetchCategories(); // recargamos la lista de categorías
                }}
              />
            )}

            {/* --- CATEGORÍAS: ACTUALIZAR --- */}
            {action === "update" && activeSection === "category" && selectedUrl && (
              <UpdateCategoryForm
                url={selectedUrl}
                onSuccess={() => {
                  resetPanel();
                  refetchCategories();
                }}
              />
            )}

            {/* --- MARCAS: CREAR --- */}
            {action === "create" && activeSection === "brand" && (
              <CreateBrandForm
                categories={categories.categories} // Para el <select> de categoría en Marca
                onSuccess={() => {
                  resetPanel();
                  refetchBrands(); // recargamos la lista de marcas
                }}
              />
            )}

            {/* --- MARCAS: ACTUALIZAR --- */}
            {action === "update" && activeSection === "brand" && selectedUrl && (
              <UpdateBrandForm
                url={selectedUrl}
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchBrands();
                }}
              />
            )}

            {/* --- SUBCATEGORÍAS: CREAR --- */}
            {action === "create" && activeSection === "subCategory" && (
              <CreateSubCategoryForm
                categories={categories.categories} // Se usa en el <select>
                onSuccess={() => {
                  resetPanel();
                  refetchSubCategories(); 
                }}
              />
            )}

            {/* --- SUBCATEGORÍAS: ACTUALIZAR --- */}
            {action === "update" &&
              activeSection === "subCategory" &&
              selectedCategoryUrl &&
              selectedSubCategoryUrl && (
                <UpdateSubCategoryForm
                  categoryUrl={selectedCategoryUrl}
                  subCategoryUrl={selectedSubCategoryUrl}
                  categories={categories.categories}
                  onSuccess={() => {
                    resetPanel();
                    refetchSubCategories();
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
