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

// ========== Formularios Tipo ==========
import CreateTypeForm from "@/app/profile/admin/types/create/CreateTypeForm";
import UpdateTypeForm from "@/app/profile/admin/types/update/UpdateTypeForm";

// ========== Formularios Rol (solo crear) ==========
import CreateRoleForm from "@/app/profile/admin/roles/create/CreateRoleForm";

// ========== Formularios Producto ==========
import CreateProductForm from "@/app/profile/admin/products/create/CreateProductForm";
import UpdateProductForm from "@/app/profile/admin/products/update/UpdateProductForm";

const AdminDashboard = () => {
  // ---- CONTEXT Y ROUTER ----
  const { currentUser, authLoading } = useContext(AuthContext);
  const router = useRouter();

  // ---- ESTADOS PARA EL PANEL DERECHO ----
  const [action, setAction] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [selectedCategoryUrl, setSelectedCategoryUrl] = useState("");
  const [selectedSubCategoryUrl, setSelectedSubCategoryUrl] = useState("");
  const [selectedProductUrl, setSelectedProductUrl] = useState("");

  // ---- VERIFICA PERMISOS ----
  useEffect(() => {
    if (
      !authLoading &&
      (!currentUser ||
        !currentUser.permissions?.includes("create") ||
        !currentUser.permissions?.includes("update") ||
        !currentUser.permissions?.includes("admin"))

    ) {
      router.push("/login");
    }
  }, [authLoading, currentUser, router]);

  const shouldFetch =
    currentUser?.permissions?.includes("create") &&
    currentUser?.permissions?.includes("update") &&
    currentUser.permissions?.includes("admin");

  // ---- FETCH DE DATOS ----
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetData(shouldFetch ? "/api/categories/private/get/list" : null, "categories", shouldFetch);

  const {
    data: brands,
    loading: brandsLoading,
    error: brandsError,
    refetch: refetchBrands,
  } = useGetData(shouldFetch ? "/api/brands/private/get/list" : null, "brands", shouldFetch);

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

  const {
    data: types,
    loading: typesLoading,
    error: typesError,
    refetch: refetchTypes,
  } = useGetData(shouldFetch ? "/api/types/private/get/list" : null, "types", shouldFetch);

  const {
    data: roles,
    loading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles,
  } = useGetData(shouldFetch ? "/api/roles/get/list" : null, "roles", shouldFetch);

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useGetData(shouldFetch ? "/api/products/private/product/get/list" : null, "products", shouldFetch);

  const loading =
    authLoading ||
    categoriesLoading ||
    brandsLoading ||
    subcategoriesLoading ||
    typesLoading ||
    rolesLoading ||
    productsLoading;

  const error =
    categoriesError ||
    brandsError ||
    subcategoriesError ||
    typesError ||
    rolesError ||
    productsError;

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

  // ---- HANDLERS ----
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

  const handleCreateSubCategory = () => {
    setActiveSection("subCategory");
    setAction("create");
    setSelectedCategoryUrl("");
    setSelectedSubCategoryUrl("");
  };
  const handleUpdateSubCategory = (catUrl, subCatUrl) => {
    setActiveSection("subCategory");
    setAction("update");
    setSelectedCategoryUrl(catUrl);
    setSelectedSubCategoryUrl(subCatUrl);
  };

  const handleCreateType = () => {
    setActiveSection("type");
    setAction("create");
    setSelectedUrl("");
  };
  const handleUpdateType = (url) => {
    setActiveSection("type");
    setAction("update");
    setSelectedUrl(url);
  };

  const handleCreateRole = () => {
    setActiveSection("role");
    setAction("create");
  };

  const handleCreateProduct = () => {
    setActiveSection("product");
    setAction("create");
  };
  const handleUpdateProduct = (url) => {
    setActiveSection("product");
    setAction("update");
    setSelectedProductUrl(url);
  };

  const resetPanel = () => {
    setAction(null);
    setActiveSection(null);
    setSelectedUrl("");
    setSelectedCategoryUrl("");
    setSelectedSubCategoryUrl("");
    setSelectedProductUrl("");
  };

  return (
    <>
      <Header textColor="black" position="relative" />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Panel de Administración
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* ===================== PANEL IZQUIERDO (40%) ===================== */}
          <div className="w-full md:w-2/5 space-y-6">
            {/* --- SECCIÓN CATEGORÍAS --- */}
            <CollapsibleSection
              title="Categorías"
              color="bg-blue-600"
              items={categories.categories}
              onCreate={handleCreateCategory}
              onUpdate={handleUpdateCategory}
            />

            {/* --- SECCIÓN MARCAS --- */}
            <CollapsibleSection
              title="Marcas"
              color="bg-red-600"
              items={brands.brands}
              onCreate={handleCreateBrand}
              onUpdate={handleUpdateBrand}
            />

            {/* --- SECCIÓN SUBCATEGORÍAS --- */}
            <CollapsibleSection
              title="Subcategorías"
              color="bg-purple-600"
              items={subcategories.subcategories}
              onCreate={handleCreateSubCategory}
              onUpdate={(subCatUrl) => {
                const sc = subcategories.subcategories.find((s) => s.url === subCatUrl);
                if (sc) {
                  handleUpdateSubCategory(sc.categoryUrl, sc.url);
                }
              }}
            />

            {/* --- SECCIÓN TIPOS --- */}
            <CollapsibleSection
              title="Tipos"
              color="bg-yellow-600"
              items={types.types}
              onCreate={handleCreateType}
              onUpdate={handleUpdateType}
            />

            {/* --- SECCIÓN ROLES (SOLO CREATE) --- */}
            <CollapsibleSection
              title="Roles"
              color="bg-teal-600"
              items={roles.roles}
              onCreate={handleCreateRole}
            />

            {/* --- SECCIÓN PRODUCTOS --- */}
            <CollapsibleSection
              title="Productos"
              color="bg-green-600"
              items={products.products}
              onCreate={handleCreateProduct}
              onUpdate={handleUpdateProduct}
            />
          </div>

          {/* ===================== PANEL DERECHO (60%) ===================== */}
          <div className="w-full md:w-3/5 bg-white shadow-lg rounded-lg p-6">
            {/* Botón para cerrar el panel */}
            {(action || activeSection) && (
              <div className="mb-4">
                <button
                  onClick={resetPanel}
                  className="text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.293a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cerrar
                </button>
              </div>
            )}

            {/* ===================== CATEGORÍAS ===================== */}
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

            {/* ===================== MARCAS ===================== */}
            {action === "create" && activeSection === "brand" && (
              <CreateBrandForm
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchBrands();
                }}
              />
            )}
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

            {/* ===================== SUBCATEGORÍAS ===================== */}
            {action === "create" && activeSection === "subCategory" && (
              <CreateSubCategoryForm
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchSubCategories();
                }}
              />
            )}
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

            {/* ===================== TIPOS ===================== */}
            {action === "create" && activeSection === "type" && (
              <CreateTypeForm
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchTypes();
                }}
              />
            )}
            {action === "update" && activeSection === "type" && selectedUrl && (
              <UpdateTypeForm
                url={selectedUrl}
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchTypes();
                }}
              />
            )}

            {/* ===================== ROLES (SOLO CREATE) ===================== */}
            {action === "create" && activeSection === "role" && (
              <CreateRoleForm
                onSuccess={() => {
                  resetPanel();
                  refetchRoles();
                }}
              />
            )}

            {/* ===================== PRODUCTOS ===================== */}
            {action === "create" && activeSection === "product" && (
              <CreateProductForm
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchProducts();
                }}
              />
            )}
            {action === "update" && activeSection === "product" && selectedProductUrl && (
              <UpdateProductForm
                url={selectedProductUrl}
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchProducts();
                }}
              />
            )}

            {/* Mensaje cuando no hay acción activa */}
            {!action && !activeSection && (
              <div className="text-center text-gray-500">
                Selecciona una sección para comenzar.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
